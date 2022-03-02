import {ReactNode, useContext, useEffect, useState} from 'react';
import {Routes, Route, Link, useMatch, useResolvedPath} from 'react-router-dom';

// Firebase
import { Functions, httpsCallable } from 'firebase/functions';
import { useAuth, useFirestore, useFunctions, useSigninCheck } from 'reactfire';
import { FirebaseError } from '@firebase/util';
import { updateUserData } from '../util/firestore';

// Components
import Dashboard from '../components/classes/Dashboard';
import Upcoming from '../components/classes/Upcoming';
import Materials from '../components/classes/Materials';
import SgySignInBtn from '../components/firebase/SgySignInBtn';
import Loading from '../components/layout/Loading';
import RedBackground from '../components/layout/RedBackground';

// Contexts
import CurrentTimeContext from '../contexts/CurrentTimeContext';
import UserDataContext, { SgyPeriod, SgyData, UserData } from '../contexts/UserDataContext';
import SgyDataContext, { SgyDataProvider } from '../contexts/SgyDataContext';

// Utilities
import { parsePeriodColor } from '../components/schedule/Periods';
import { useScreenType } from '../hooks/useScreenType';
import { bgColor } from '../util/progressBarColor';
import { Menu } from 'react-feather';
import { shortify } from '../util/sgyHelpers';
import { cleanupExpired } from '../util/sgyFunctions';


export async function fetchSgyMaterials(functions: Functions) {
    localStorage.setItem('sgy-last-attempted-fetch', '' + Date.now());

    // HttpsCallable<T, K> where T is the type of the arguments to the callable and K is the return type
    const fetchMaterials = httpsCallable<undefined, SgyData>(functions, 'sgyfetch-fetchMaterials');
    const res = await fetchMaterials();

    localStorage.setItem('sgy-data', JSON.stringify(res.data));
    localStorage.setItem('sgy-last-fetched', '' + Date.now());

    return res.data;
}

// TODO: we can probably do this in a similar way to <Sidebar>, where the items themselves don't care whether
// they are collapsed or not and the `hidden` is just set in CSS.
// Maybe this is a better pattern though, unsure; at the very least we could extract into a separate file for
// organizational purposes.
type ClassesSidebarItemProps = {
    collapsed: boolean, name: string, color: string, period: string,
    onClick: () => void, active: boolean
}
function ClassesSidebarItem(props: ClassesSidebarItemProps) {
    const {collapsed, name, color, period, onClick, active} = props;

    const screenType = useScreenType();
    if (collapsed) {
        return (
            <div
                style={{ 
                    backgroundColor: color,
                    border: active ? `3px solid ${bgColor(color)}` : ''
                }}
                className={"classes-sidebar-bubble " + screenType}
                onClick={onClick}
            >
                {period}
            </div>
        );
    } else {
        return (
            <div className='classes-sidebar-item'>
                <div className='classes-sidebar-text'>{shortify(name, 20)}</div>
                <div
                    style={{
                        backgroundColor: color,
                        border: active ? `3px solid ${bgColor(color)}` : ''
                    }}
                    className={"classes-sidebar-bubble " + screenType}
                    onClick={onClick}
                >
                    {period}
                </div>
            </div>
        );
    }
}

function ClassesSidebar(props: { selected: SgyPeriod | 'A', setSelected: (selected:SgyPeriod|'A') => void}) {
    const { selected, setSelected } = props;
    const userData = useContext(UserDataContext);

    // collapsed?
    const [collapsed, setCollapsed] = useState(true);
    const { sgyData } = useContext(SgyDataContext);

    const classes = findClassesList(sgyData, userData);
    const screenType = useScreenType();

    return (
        <div className={"classes-sidebar " + screenType + " " + (collapsed ? 'collapsed' : 'expanded')}>
            {classes.map((c) => (
                <ClassesSidebarItem
                    key={c.period}
                    {...c}
                    collapsed={collapsed}
                    active={selected === c.period}
                    onClick={() => setSelected(c.period)}
                />
            ))}
            <Menu size={40} style={{marginTop: 'auto', cursor:'pointer'}} onClick={() => setCollapsed(!collapsed)} />
        </div>
    )
}

// This can probably be merged into Classes
function ClassesHeader() {
    const {selected} = useContext(SgyDataContext);
    const userData = useContext(UserDataContext);
    const { sgyData } = useContext(SgyDataContext);

    const {name, color} = findClassesList(sgyData, userData).find(({period}) => period === selected)!;

    return (
        <header className="classes-header">
            <div className="classes-header-bubble" style={{backgroundColor: color}} />
            <h1 className="classes-header-text">{name}</h1>
        </header>
    )
}

function ClassesNavBarItem(props: {text: string, to: string}) {
    const {text, to} = props;

    const resolved = useResolvedPath(to);
    const match = useMatch({ path: resolved.pathname, end: true });

    return (
        <div className={'classes-navbar-item' + (match ? ' selected' : '')}>
            <Link to={to}>
                {text}
            </Link>
        </div>
    )
}

export default function Classes() {
    const functions = useFunctions();
    const auth = useAuth();
    const firestore = useFirestore();
    const { data: signInCheckResult } = useSigninCheck();
    const signedIn = signInCheckResult?.signedIn && auth.currentUser;

    const userData = useContext(UserDataContext);
    const time = useContext(CurrentTimeContext);
    const screenType = useScreenType();

    const [fetching, setFetching] = useState(false);
    const [lastFetched, setLastFetched] = useState<null | number>(null);
    const [lastAttemptedFetch, setLastAttemptedFetch] = useState<null | number>(null);

    // Raw Schoology Data
    const [sgyData, setSgyData] = useState<null | SgyData>(null);

    const updateSgy = async () => {

        if (lastFetched && Date.now() - lastFetched < 6 * 1000) // if it's been less than 5 seconds since the last attempted fetch
        {
            // this is a problem!!!
            console.error('Attempted to fetch within 5 seconds of previous fetch!')
            throw 'Cannot fetch within 5 seconds of previous fetch!!';
        }

        if(fetching) {
            console.error('Attempted to fetch but already fetching!')
            throw 'Already fetching!!!';
        }

        setFetching(true);
        setLastAttemptedFetch(Date.now());

        const newSgyData = await fetchSgyMaterials(functions)
            .catch((err: FirebaseError) => console.error(err));

        setSgyData(newSgyData || null);

        // update classes!
        if(newSgyData) {

            let needToReset = false;
            let classes: {[key:string]: any} = {};

            const periods: SgyPeriod[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', 'S'];
            for (const p of periods) {
                const course = userData.classes[p];

                classes[p] = { ...userData.classes[p] };

                if(newSgyData[p]) {
                    // exists! if the ID is wrong, reset the name and ID
                    const sgycourse = newSgyData[p]!;
                    if(course.s !== sgycourse.info.id) {
                        // reset
                        classes[p] = {
                            ...userData.classes[p], 
                            n: `${sgycourse.info.course_title} · ${sgycourse.info.section_title.split(' ')[1]}`,
                            s: sgycourse.info.id
                        };
                        needToReset = true;
                    }
                } else {
                    // doesn't exist
                    if(course.s) {
                        // if it still has an id, we have smthg wrong...
                        classes[p] = { ...userData.classes[p], s: '' };
                        needToReset = true;
                    }
                }
            }

            if(needToReset) {
                updateUserData('classes', classes, auth, firestore);
            }
        }

        setLastFetched(Date.now());
        setFetching(false);
    }

    // read from localstorage data on the first time
    useEffect( () => {
        const lsLastFetched = parseInt(localStorage.getItem('sgy-last-fetched') ?? '');
        const lsLastAttemptedFetch = parseInt(localStorage.getItem('sgy-last-attempted-fetch') ?? '');
        const lsSgyData = JSON.parse(localStorage.getItem('sgy-data') ?? 'null');

        let needToFetch = false;
        if (!isNaN(lsLastFetched)) {
            setLastFetched(lsLastFetched);
        } else {
            needToFetch = true;
        }

        if (!isNaN(lsLastAttemptedFetch)) {
            setLastAttemptedFetch(lsLastAttemptedFetch);
        } else {
            needToFetch = true;
        }

        if (lsSgyData == null){
            needToFetch = true;
        }

        setSgyData(lsSgyData);

        if (needToFetch && signedIn && userData.options.sgy) {
            updateSgy();
        }
    }, [userData.options.sgy]);
    // this was originally going to trigger on sign in
    // however, there is a period of time between being signed in and changing to firebase data from localstorage
    // this change remounts everything, and if this effect triggered on sign in, it would actually trigger twice;
    // once between this short time between sign in and userData provider change, and once afterwards (since all state is forgotten on remount)
    // to fix this, I do not allow this useEffect to trigger on sign in. Instead, it will trigger after the remount.

    // cleanup of old items in data
    useEffect( () => {
        cleanupExpired(userData, auth, firestore);
    }, [])

    // preferably this would trigger every 15 minutes
    // TODO: can perhaps use intervals for this?
    useEffect(() => {
        if (signedIn && userData.options.sgy) {
            // Fetching Schoology stuff
            if (!lastAttemptedFetch) return; // if lastFetched doesn't exist, it means the other useEffect hasn't run yet
            if (fetching) return; // if fetching already, we don't need to fetch

            // If diff > 15 minutes, update schoology
            const diff = Date.now() - lastAttemptedFetch;
            if (diff > 1000 * 60 * 15) {
                updateSgy();
            }
        }
    }, [signedIn, time]);

    // Selected
    const [selected, setSelected] = useState<SgyPeriod|'A'>('A');

    // we are ok to go if: 1) we're signed in 2) the user enabled schoology 3) the sgy data exists
    if (!signedIn) return (
        <ClassesErrorBurrito>
            <h2 className="text-2xl font-semibold mb-3">You aren't signed in!</h2>
            <p className="secondary">
                Classes requires Schoology integration, which requires an account. Please sign in to continue.
            </p>
        </ClassesErrorBurrito>
    )
    if (!userData.options.sgy) return (
        <ClassesErrorBurrito>
            <h2 className="text-2xl font-semibold mb-3">Connect Schoology</h2>
            <p className="secondary mb-3">
                This section uses Schoology integration, which requires you to connect your Schoology account.
                Press the button below to continue.
            </p>
            <div className="sgy-auth-button">
                <SgySignInBtn />
            </div>
        </ClassesErrorBurrito>
    )
    if (!sgyData) return (
        <ClassesErrorBurrito>
            {fetching ? (
                <Loading>Fetching materials. This can take up to a minute...</Loading>
            ) : (<>
                <h2 className="text-2xl font-semibold mb-3">Something Went Wrong.</h2>
                <p className="secondary">
                    Your user data is missing! Please click the button below to fetch materials.
                    If this is a recurring problem, please submit an issue to Github.
                </p>
                <div className="sgy-auth-button">
                    <button onClick={updateSgy}>Fetch Materials</button>
                </div>
            </>)}
        </ClassesErrorBurrito>
    )
    if (!userData.sgy?.custom || !userData.sgy?.custom.assignments || !userData.sgy?.custom.labels || !userData.sgy?.custom.modified)
        return <Loading /> // make sure user has all of these things :D, if not, usually gets corrected by FirebaseUserDataProvider

    return (
        <SgyDataProvider value={{sgyData, fetching, lastFetched, lastAttemptedFetch, selected, updateSgy}}>
            <div className={"classes-burrito " + screenType}>
                <RedBackground />

                <div className={"classes-content " + screenType}>
                    <ClassesHeader />

                    <div className="classes-navbar">
                        <ClassesNavBarItem text="Dashboard" to="." />
                        <ClassesNavBarItem text="Upcoming" to="upcoming" />
                        <ClassesNavBarItem text="Materials" to="materials" />
                    </div>

                    <div className="classes-page">
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/upcoming" element={<Upcoming />} />
                            <Route path="/materials" element={<Materials />} />
                        </Routes>
                    </div>
                </div>

                {/* Kill the sidebar on phone; this is a temporary solution */}
                {/* TODO: think about how to implement class switching on mobile without it looking ugly */}
                {screenType !== 'phone' && <ClassesSidebar selected={selected} setSelected={setSelected}/>}
            </div>
        </SgyDataProvider>
    )
}

// A wrapper that centers all the error messages
function ClassesErrorBurrito(props: { children?: ReactNode}) {
    return <>
        <RedBackground />
        <div className="w-full h-screen flex items-center justify-center">
            <div className="classes-error-content rounded p-6 text-center bg-sidebar dark:bg-sidebar-dark">
                {props.children}
            </div>
        </div>
    </>
}

// Returns a parsed class array given a populated userData object.
// If `includeAll` is true, the first class will be an "All Courses" object with default color.
export function findClassesList(sgyData: SgyData, userData: UserData, includeAll: boolean = true) {
    // find classes from userData
    const classes: { name: string, color: string, period: SgyPeriod | 'A' }[] = [];

    // Push "All Courses" object
    if (includeAll) {
        classes.push({
            name: "All Courses",
            color: parsePeriodColor("default", userData), // lol it spits out the default color if it doesn't recognize the period name; kinda a hacky workaround
            period: "A"
        });
    }

    for (const [p, course] of Object.entries(userData.classes)) {
        if (course.s && p in sgyData) {
            classes.push({
                name: course.n,
                color: parsePeriodColor(p, userData),
                period: p as SgyPeriod
            });
        }
    }

    return classes;
}
