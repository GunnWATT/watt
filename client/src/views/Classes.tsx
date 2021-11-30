import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import CurrentTimeContext from "../contexts/CurrentTimeContext";
import UserDataContext, { SgyData, SgyPeriodData, UserData } from "../contexts/UserDataContext";
import SgySignInBtn from "../components/firebase/SgySignInBtn";
import Loading from "../components/layout/Loading";
import RedBackground from '../components/layout/RedBackground';
import {Routes, Route} from 'react-router-dom';
import {Nav, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

// firebase
import { Functions, httpsCallable } from 'firebase/functions';
import { useAuth, useFunctions } from "reactfire";

// views
import Dashboard from '../components/classes/Dashboard';
import { parsePeriodColor } from "../components/schedule/Periods";
import { useScreenType } from "../hooks/useScreenType";
import { Upcoming } from "../components/classes/Upcoming";
import { useLocation } from "react-router";

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

export const findClassesList = (userData:UserData, includeAll?:boolean) => {
    // find classes from userData
    const classes: { name: string, color: string, period: string }[] = [];

    // All courses
    if(includeAll!==false) {
            classes.push({
            name: "All Courses",
            color: parsePeriodColor("default", userData), // lol it spits out the default color if it doesn't recognize the period name; kinda a hacky workaround
            period: "A"
        });
    }

    for (const p in userData.classes) {

        // @ts-ignore
        const course: SgyPeriodData = userData.classes[p];

        if (course.s) {
            const c = {
                name: course.n,
                color: parsePeriodColor(p, userData),
                period: p
            };
            classes.push(c)
        }
    }

    return classes;
}

const ClassesSidebar = (props:{userData: UserData, setSelected:(selected:string)=>void }) => {

    const {userData, setSelected} = props;

    // collapsed?
    const [collapsed, setCollapsed] = useState<boolean>(true);

    const classes = findClassesList(userData);

    const screenType = useScreenType();

    return <div className={"classes-sidebar " + screenType}> 
        {classes.map(({name,color,period}) => <ClassesSidebarItem key={period} name={name} color={color} period={period} collapsed={collapsed} onClick={() => setSelected(period)} />)}
    </div>
}

const ClassesHeader = (props:{userData:UserData, selected:string}) => {
    const {userData, selected} = props;
    const classInfo = findClassesList(userData).find(({period}) => period === selected);

    const {name, color} = classInfo!; // lol this is fine

    return <div className="classes-header">
        <div className="classes-header-bubble" style={{backgroundColor:color}}></div>
        <div className="classes-header-text">{name}</div>
    </div>
}

const ClassesNavBarItem = (props:{selected:boolean, onClick:()=>void, text:string}) => {
    const {selected,onClick,text} = props;
    return <div onClick={onClick} className={selected ? "classes-navbar-item-selected" : "classes-navbar-item"}>
        {text}
    </div>
}

const ClassesNavBar = (props:{view: number, setView:(view:number)=>void}) => {

    const {view, setView} = props;
    const views = ["Dashboard", "Upcoming", "Materials"]

    return <div className={"classes-navbar"}>
        {views.map((name, index) => 
            <ClassesNavBarItem key={name} selected={index===view} text={name} onClick={() => setView(index)} />
        )}
    </div>
}

export default function Classes() {

    const functions = useFunctions();
    const auth = useAuth();

    const userData = useContext(UserDataContext);
    const time = useContext(CurrentTimeContext);
    const screenType = useScreenType();

    // Selected
    const [selected, setSelected] = useState<string>('A');

    // We use hash for stuff lol
    const { search, pathname, hash } = useLocation();

    const views = ['dashboard', 'upcoming', 'materials']
    const defaultview = (views.includes(hash.slice(1))) ? views.indexOf(hash.slice(1)) : 0;

    // Selected View
    // 0 - dashboard
    // 1 - upcoming
    // 2 - materials
    // possible 3 - tasks
    const [view, setRawView] = useState(defaultview);
    
    const setView = (v: number ) => {
        setRawView(v);
        window.location.hash = views[v];
    }

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
    const ok = auth.currentUser && userData.options.sgy && sgyData != null;

    // not ok :pnsv:
    if(!ok) {
        if (!auth.currentUser) return <ClassesNotSignedIn />

        if (!userData.options.sgy) return <ClassesSgyNotConnected />

        if (sgyData == null) return <ClassesDataMissing fetchMaterials={() => fetchSgyMaterials(functions)} lastFetched={lastFetched} />
    }

    
    
    return (
        <div className={"classes-burrito " + screenType}>
            <RedBackground />
            <div className={"classes-content " + screenType}>
                <ClassesHeader selected={selected} userData={userData} />
                <ClassesNavBar view={view} setView={setView} />

                {view === 0 ? <Dashboard selected={selected} sgyData={sgyData} /> : null}
                {view === 1 ? <Upcoming selected={selected} sgyData={sgyData} /> : null}
            </div>
           <ClassesSidebar userData={userData} setSelected={setSelected} />
        </div>
    )
}
