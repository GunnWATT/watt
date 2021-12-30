import {ReactNode, useContext, useEffect, useState} from 'react';
import {Routes, Route, Link, useMatch, useResolvedPath} from 'react-router-dom';
import {Container} from 'reactstrap';

// Firebase
import { Functions, httpsCallable } from 'firebase/functions';
import { useAuth, useFirestore, useFunctions, useSigninCheck } from 'reactfire';
import { FirebaseError } from '@firebase/util';

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
import { bgColor } from '../components/schedule/progressBarColor';
import { Menu } from 'react-feather';
import { shortify } from '../components/classes/functions/GeneralHelperFunctions';
import { cleanupExpired } from '../components/classes/functions/SgyFunctions';


export async function fetchSgyMaterials(functions: Functions) {
    localStorage.setItem('sgy-last-attempted-fetch', '' + Date.now());

    // HttpsCallable<T, K> where T is the type of the arguments to the callable and K is the return type
    const fetchMaterials = httpsCallable<undefined, SgyData>(functions, 'sgyfetch-fetchMaterials');
    const res = await fetchMaterials();

    localStorage.setItem('sgy-data', JSON.stringify(res.data));
    localStorage.setItem('sgy-last-fetched', '' + Date.now());

    return res.data;
}

// A wrapper that centers all the error messages
function ClassesErrorBurrito(props: { children?: ReactNode}) {
    return <> 
        <div className="classes-error-burrito">
            <div className="classes-error-content">
                {props.children}
            </div>
        </div>
    </>
}

function ClassesNotSignedIn() {
    return (
        <ClassesErrorBurrito>
            <h2>You aren't signed in!</h2>
            <p>Classes requires Schoology integration, which requires an account. Please sign in to continue.</p>
        </ClassesErrorBurrito>
    )
}

function ClassesSgyNotConnected() {
    return (
        <ClassesErrorBurrito>
            <h2>Connect Schoology</h2>
            <p>
                This section uses Schoology integration, which requires you to connect your Schoology account.
                Press the button below to continue.
            </p>
            <div className='sgy-auth-button'>
                <SgySignInBtn />
            </div>
        </ClassesErrorBurrito>
    )
}

function ClassesFetching() {
    const sgyInfo = useContext(SgyDataContext);

    return (
        <ClassesErrorBurrito>
            {sgyInfo.fetching ? (
                <Loading>Fetching materials. This can take up to a minute...</Loading>
            ) : (<>
                <h2>Something Went Wrong.</h2>
                <p>
                    Your user data is missing! Please click the button below to fetch materials.
                    If this is a recurring problem, please submit an issue to Github.
                </p>
                <div className='sgy-auth-button'>
                    <button onClick={sgyInfo.updateSgy}>Fetch Materials</button>
                </div>
            </>)}
        </ClassesErrorBurrito>
    )
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

    const classes = findClassesList(userData);
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
    const {name, color} = findClassesList(userData).find(({period}) => period === selected)!;

    return (
        <Container className="classes-header">
            <div className="classes-header-bubble" style={{backgroundColor: color}} />
            <h1 className="classes-header-text">{name}</h1>
        </Container>
    )
}

function ClassesNavBarItem(props: {text: string, to: string}) {
    const {text, to} = props;

    const resolved = useResolvedPath(to);
    const match = useMatch({ path: resolved.pathname, end: true });

    return (
        // TODO: 'classes-navbar-item selected' is a better pattern than 'classes-navbar-item-selected' for CSS reuse.
        // Currently this forces a mixin with duplicated styles.
        <div className={match ? "classes-navbar-item-selected" : "classes-navbar-item"}>
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
    const signedIn = signInCheckResult?.signedIn;

    const userData = useContext(UserDataContext);
    const time = useContext(CurrentTimeContext);
    const screenType = useScreenType();

    const [fetching, setFetching] = useState(false);
    const [lastFetched, setLastFetched] = useState<null | number>(null);
    const [lastAttemptedFetch, setLastAttemptedFetch] = useState<null | number>(null);
    // Raw Schoology Data
    const [sgyData, setSgyData] = useState<null | SgyData>(null);

    const updateSgy = async () => {

        if(lastFetched && Date.now() - lastFetched < 6 * 1000) // if it's been less than 5 seconds since the last fetch
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

        if (needToFetch && signedIn) {
            updateSgy();
        }
    }, [signedIn]);

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
            if (diff > 1000 * 60 * 15) updateSgy();
        }
    }, [signedIn, time]);

    // Selected
    const [selected, setSelected] = useState<SgyPeriod|'A'>('A');

    // we are ok to go if: 1) we're signed in 2) the user enabled schoology 3) the sgy data exists
    if (!signedIn) return <ClassesNotSignedIn />
    if (!userData.options.sgy) return <ClassesSgyNotConnected />
    if (sgyData == null) return <ClassesFetching />
    if (!userData.sgy?.custom || !userData.sgy?.custom.assignments || !userData.sgy?.custom.labels || !userData.sgy?.custom.modified)
        return <Loading /> // make sure user has all of these things :D, if not, usually gets corrected by FirebaseUserDataProvider

    return (
        <SgyDataProvider value={{sgyData, fetching, lastFetched, lastAttemptedFetch, selected, updateSgy}}>
            <div className={"classes-burrito " + screenType}>
                <RedBackground />

                <div className={"classes-content " + screenType}>
                    <ClassesHeader />

                    <Container className="classes-navbar">
                        <ClassesNavBarItem text="Dashboard" to="." />
                        <ClassesNavBarItem text="Upcoming" to="upcoming" />
                        <ClassesNavBarItem text="Materials" to="materials" />
                    </Container>

                    <Container className="classes-page">
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/upcoming" element={<Upcoming /> } />
                            <Route path="/materials" element={<Materials />} />
                        </Routes>
                    </Container>
                </div>

                <ClassesSidebar selected={selected} setSelected={setSelected} />
            </div>
        </SgyDataProvider>
    )
}

// Returns a parsed class array given a populated userData object.
// If `includeAll` is true, the first class will be an "All Courses" object with default color.
export function findClassesList(userData: UserData, includeAll: boolean = true) {
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
        if (course.s) {
            classes.push({
                name: course.n,
                color: parsePeriodColor(p, userData),
                period: p as SgyPeriod
            });
        }
    }

    return classes;
}
