import { useContext, useEffect, useState } from 'react';
import {Routes, Route, Link, useMatch, useResolvedPath} from 'react-router-dom';

// Firebase
import { Functions, httpsCallable } from 'firebase/functions';
import { useAuth, useFunctions } from 'reactfire';

// Moment
import { Moment } from 'moment';

// Components
import Dashboard from '../components/classes/Dashboard';
import Upcoming from '../components/classes/Upcoming';
import Materials from '../components/classes/Materials';
import SgySignInBtn from '../components/firebase/SgySignInBtn';
import Loading from '../components/layout/Loading';
import RedBackground from '../components/layout/RedBackground';

// Contexts
import CurrentTimeContext from '../contexts/CurrentTimeContext';
import UserDataContext, { SgyData, UserData } from '../contexts/UserDataContext';

// Utilities
import { parsePeriodColor } from '../components/schedule/Periods';
import { useScreenType } from '../hooks/useScreenType';
import { SgyDataProvider } from '../contexts/SgyDataContext';



export const fetchSgyMaterials = (async (functions: Functions) => {
    const fetchMaterials = httpsCallable(functions, 'sgyfetch-fetchMaterials');
    const res = (await fetchMaterials());
    localStorage.setItem('sgy-data', JSON.stringify(res.data));
    localStorage.setItem('sgy-last-fetched', '' + Date.now());

    return res.data;
});

// A wrapper that centers all the error messages
const ClassesErrorBurrito = (props: { children?: React.ReactNode}) => {
    return <> 
        <div className="classes-error-burrito">
            <div className="classes-error-content">
                {props.children}
            </div>
        </div>
    </>
}

const ClassesNotSignedIn = () => {
    return (
        <ClassesErrorBurrito>
            <h2>You aren't signed in!</h2>
            <p>Classes requires Schoology integration, which requires an account. Please sign in to continue.</p>
        </ClassesErrorBurrito>
    )
}

const ClassesSgyNotConnected = () => {
    return (
        <ClassesErrorBurrito>
            <h2>Connect Schoology</h2>
            <p>This section uses Schoology integration, which requires you to connect your Schoology account. Press the button below to continue.</p>
            <div className='sgy-auth-button'>
                <SgySignInBtn />
            </div>
        </ClassesErrorBurrito>
    )
}

const ClassesFetching = () => {
    return <ClassesErrorBurrito>
        <Loading message={'Fetching materials. This can take up to a minute...'} />
    </ClassesErrorBurrito>
}

const ClassesSidebarItem = (props:{collapsed:boolean, name: string, color:string, period:string, onClick:()=>void}) => {
    const {collapsed,name,color,period,onClick} = props;

    const screenType = useScreenType();
    if(collapsed) {
        return <div style={{ backgroundColor: color }} 
            className={"classes-collapsed-sidebar-item " + screenType}
            onClick={onClick}>
                {period}
        </div>
    }

    return null;
}

// TODO: this can 200% be put in Classes
function ClassesSidebar(props: {setSelected: (selected:string) => void}) {
    const {setSelected} = props;
    const userData = useContext(UserDataContext);

    // collapsed?
    const [collapsed, setCollapsed] = useState<boolean>(true);

    const classes = findClassesList(userData);

    const screenType = useScreenType();

    return <div className={"classes-sidebar " + screenType}> 
        {classes.map(({name,color,period}) => <ClassesSidebarItem key={period} name={name} color={color} period={period} collapsed={collapsed} onClick={() => setSelected(period)} />)}
    </div>
}

// TODO: this can definitely be put in Classes and be fine
function ClassesHeader(props: {selected: string}) {
    const {selected} = props;
    const userData = useContext(UserDataContext);
    const classInfo = findClassesList(userData).find(({period}) => period === selected);

    const {name, color} = classInfo!; // lol this is fine

    return <div className="classes-header">
        <div className="classes-header-bubble" style={{backgroundColor: color}} />
        <div className="classes-header-text">{name}</div>
    </div>
}

// TODO: perhaps move this to another component
function ClassesNavBarItem(props: {text: string, to: string}) {
    const {text, to} = props;

    const resolved = useResolvedPath(to);
    const match = useMatch({ path: resolved.pathname, end: true });

    return (
        <div className={match ? "classes-navbar-item-selected" : "classes-navbar-item"}>
            <Link to={to}>
                {text}
            </Link>
        </div>
    )
}

const ClassesNavBar = () => {
    return (
        <div className="classes-navbar">
            <ClassesNavBarItem text="Dashboard" to="." />
            <ClassesNavBarItem text="Upcoming" to="upcoming" />
            <ClassesNavBarItem text="Materials" to="materials" />
        </div>
    )
}

export default function Classes() {
    const functions = useFunctions();
    const auth = useAuth();

    const userData = useContext(UserDataContext);
    const time = useContext(CurrentTimeContext);
    const screenType = useScreenType();

    const [fetching, setFetching] = useState(false);
    const [lastFetched, setLastFetched] = useState<null | number>(null);
    // Raw Schoology Data
    const [sgyData, setSgyData] = useState<null | SgyData>(null);

    const updateSgy = async () => {

        setFetching(true);

        const sgyData = await fetchSgyMaterials(functions);

        // @ts-ignore
        setSgyData(sgyData);

        setLastFetched(Date.now());
        setFetching(false);
    }

    // read from firebase data on the first time
    useEffect( () => {
        const lsLastFetched = parseInt(localStorage.getItem('sgy-last-fetched') ?? '');
        const lsSgyData = JSON.parse(localStorage.getItem('sgy-data') ?? 'null');

        let needToFetch = false;
        if(!isNaN(lsLastFetched)) {
            setLastFetched( lsLastFetched );
        } else {
            needToFetch = true;
        }

        if(lsSgyData == null){
            needToFetch = true;
        }

        setSgyData(lsSgyData);

        if(needToFetch) {
            updateSgy();
        }
    }, []);

    // preferably this would trigger every 15 minutes
    useEffect(() => {
        if (auth.currentUser && userData.options.sgy) {
            // Fetching Schoology stuff
            if(!lastFetched) return; // if lastFetched doesn't exist, it means the other useEffect hasn't run yet
            if(fetching) return; // if fetching already, we don't need to fetch
            const diff = Date.now() - lastFetched;

            if (diff > 1000 * 60 * 15) // 15 minutes
            {
                updateSgy();
            }
        }
    }, [auth.currentUser, time]);

    // Selected
    const [selected, setSelected] = useState<string>('A');

    // we are ok to go if: 1) we're signed in 2) the user enabled schoology 3) the sgy data exists
    if (!auth.currentUser) return <ClassesNotSignedIn />
    if (!userData.options.sgy) return <ClassesSgyNotConnected />
    if (sgyData == null) return <ClassesFetching />
    if (!userData.sgy?.custom || !userData.sgy?.custom.assignments || !userData.sgy?.custom.labels || !userData.sgy?.custom.modified) return <Loading /> // make sure user has all of these things :D, if not, usually gets corrected by FirebaseUserDataProvider

    return (
        <SgyDataProvider value={null}>
            <div className={"classes-burrito " + screenType}>
                <RedBackground />
                <div className={"classes-content " + screenType}>
                    <ClassesHeader selected={selected} />
                    <ClassesNavBar />

                    <Routes>
                        <Route path="/" element={<Dashboard selected={selected} sgyData={sgyData} />} />
                        <Route path="/upcoming" element={<Upcoming selected={selected} sgyData={sgyData} /> } />
                        <Route path="/materials" element={<Materials selected={selected} sgyData={sgyData} />} />
                    </Routes>
                </div>
            <ClassesSidebar setSelected={setSelected} />
            </div>
        </SgyDataProvider>
    )
}

// Returns a parsed class array given a populated userData object.
// If `includeAll` is true, the first class will be an "All Courses" object with default color.
export function findClassesList(userData: UserData, includeAll: boolean = true) {
    // find classes from userData
    const classes: { name: string, color: string, period: string }[] = [];

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
                period: p
            });
        }
    }

    return classes;
}
