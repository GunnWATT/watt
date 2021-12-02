import { useContext, useEffect, useState } from 'react';
import {Routes, Route, Link, useMatch, useResolvedPath} from 'react-router-dom';

// Firebase
import { Functions, httpsCallable } from 'firebase/functions';
import { useAuth, useFunctions } from "reactfire";

// Components
import Dashboard from '../components/classes/Dashboard';
import Upcoming from '../components/classes/Upcoming';
import SgySignInBtn from '../components/firebase/SgySignInBtn';
import Loading from '../components/layout/Loading';
import RedBackground from '../components/layout/RedBackground';
import WIP from '../components/layout/WIP';

// Contexts
import CurrentTimeContext from '../contexts/CurrentTimeContext';
import UserDataContext, { SgyData, SgyPeriodData, UserData } from '../contexts/UserDataContext';

// Utilities
import { parsePeriodColor } from '../components/schedule/Periods';
import { useScreenType } from '../hooks/useScreenType';
import { Materials } from '../components/classes/Materials';

export const fetchSgyMaterials = (async (functions: Functions) => {
    const fetchMaterials = httpsCallable(functions, 'sgyfetch-fetchMaterials');
    localStorage.setItem('sgy-last-fetched', '' + Date.now()); // This redundancy is important!
    const res = (await fetchMaterials());
    // console.log(res);
    localStorage.setItem('sgy-data', JSON.stringify(res.data));
    localStorage.setItem('sgy-last-fetched', '' + Date.now());
});

export const findLastFetched = () => {
    try {
        return parseInt(localStorage.getItem('sgy-last-fetched') ?? '0')
    } catch (err) {
        return null;
    }
};

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

const ClassesDataMissing = (props: { lastFetched: number | null, fetchMaterials: () => void }) => {
    const { lastFetched, fetchMaterials } = props;
    // if it's fetching probably soon (within 60 secs of last fetch)
    if (lastFetched && Date.now() - lastFetched < 1000 * 60) {
        return <ClassesErrorBurrito>
            <Loading message={'Fetching materials. This can take up to a minute...'} />
        </ClassesErrorBurrito>
    } else {
        return (
            <ClassesErrorBurrito>
                <h2>Something Went Wrong.</h2>
                <p>Your user data is missing! Please click the button below to fetch materials. If this is a recurring problem, please submit an issue to Github.</p>
                <div className='sgy-auth-button'>
                    <button onClick={fetchMaterials}>Fetch Materials</button>
                </div>
            </ClassesErrorBurrito>
        )
    }
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

    // Selected
    const [selected, setSelected] = useState<string>('A');
    
    // Raw Schoology Data
    const [sgyData, setSgyData] = useState<null | SgyData>(null);

    // Every time last fetched changes, fetch Schoology Data
    const lastFetched = findLastFetched();
    useEffect(() => {
        try {
            setSgyData(JSON.parse(localStorage.getItem('sgy-data') ?? 'null'));
        } catch (err) {
            setSgyData(null);
            console.log(err);
        }
    }, [lastFetched])

    // we are ok to go if: 1) we're signed in 2) the user enabled schoology 3) the sgy data exists
    if (!auth.currentUser) return <ClassesNotSignedIn />
    if (!userData.options.sgy) return <ClassesSgyNotConnected />
    if (sgyData == null) return <ClassesDataMissing fetchMaterials={() => fetchSgyMaterials(functions)} lastFetched={lastFetched} />

    return (
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
