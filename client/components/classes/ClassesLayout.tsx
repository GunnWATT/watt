import {ReactNode, useContext, useEffect, useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/router';

// Components
import AppLayout from '../layout/AppLayout';
import ClassesHeader from './ClassesHeader';
import SgySignInBtn from '../firebase/SgySignInBtn';
import Loading from '../layout/Loading';
import Wave from '../layout/Wave';

// Firebase
import { Functions, httpsCallable } from 'firebase/functions';
import { useAuth, useFirestore, useFunctions, useSigninCheck } from 'reactfire';
import { FirebaseError } from '@firebase/util';
import { updateUserData } from '../../util/firestore';

// Contexts
import CurrentTimeContext from '../../contexts/CurrentTimeContext';
import UserDataContext, { SgyPeriod, SgyData, UserData } from '../../contexts/UserDataContext';
import { SgyDataProvider } from '../../contexts/SgyDataContext';

// Utilities
import { parsePeriodColor } from '../schedule/Periods';
import { useScreenType } from '../../hooks/useScreenType';
import { cleanupExpired } from '../../util/sgyAssignments';


export async function fetchSgyMaterials(functions: Functions) {
    localStorage.setItem('sgy-last-attempted-fetch', '' + Date.now());

    // HttpsCallable<T, K> where T is the type of the arguments to the callable and K is the return type
    const fetchMaterials = httpsCallable<undefined, SgyData>(functions, 'sgyfetch-fetchMaterials');
    const res = await fetchMaterials();

    localStorage.setItem('sgy-data', JSON.stringify(res.data));
    localStorage.setItem('sgy-last-fetched', '' + Date.now());

    return res.data;
}

export default function ClassesLayout(props: {children: ReactNode}) {
    const functions = useFunctions();
    const auth = useAuth();
    const firestore = useFirestore();
    const { data: signInCheckResult } = useSigninCheck();
    const signedIn = signInCheckResult?.signedIn && auth.currentUser;

    const userData = useContext(UserDataContext);
    const time = useContext(CurrentTimeContext);
    const screenType = useScreenType();

    const [fetching, setFetching] = useState(false);
    const [lastFetched, setLastFetched] = useState<number | null>(null);
    const [lastAttemptedFetch, setLastAttemptedFetch] = useState<number | null>(null);

    // Raw Schoology Data
    const [sgyData, setSgyData] = useState<SgyData | null>(null);

    const updateSgy = async () => {
        // If it's been less than 5 seconds since the last attempted fetch
        if (lastFetched && Date.now() - lastFetched < 6 * 1000)
            return console.error('Attempted to fetch within 5 seconds of previous fetch!');
        if (fetching)
            return console.error('Attempted to fetch but already fetching!');

        setFetching(true);
        setLastAttemptedFetch(Date.now());

        const newSgyData = await fetchSgyMaterials(functions)
            .catch((err: FirebaseError) => console.error(err));

        setSgyData(newSgyData || null);

        // update classes!
        if (newSgyData) {
            let needToReset = false;
            let classes: {[key:string]: any} = {};

            const periods: SgyPeriod[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', 'S'];
            for (const p of periods) {
                const course = userData.classes[p];

                classes[p] = { ...userData.classes[p] };

                if (newSgyData[p]) {
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

            if (needToReset) await updateUserData('classes', classes, auth, firestore);
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

        if (needToFetch && signedIn && userData.options.sgy) updateSgy();
    }, [userData.options.sgy]);
    // this was originally going to trigger on sign in
    // however, there is a period of time between being signed in and changing to firebase data from localstorage
    // this change remounts everything, and if this effect triggered on sign in, it would actually trigger twice;
    // once between this short time between sign in and userData provider change, and once afterwards (since all state is forgotten on remount)
    // to fix this, I do not allow this useEffect to trigger on sign in. Instead, it will trigger after the remount.

    // cleanup of old items in data
    useEffect(() => {
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
    const [selected, setSelected] = useState<SgyPeriod | 'A'>('A');

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
            <SgySignInBtn />
        </ClassesErrorBurrito>
    )
    if (!sgyData) return (
        <ClassesErrorBurrito>
            {fetching ? (
                <Loading>Fetching materials. This can take up to a minute...</Loading>
            ) : (<>
                <h2 className="text-2xl font-semibold mb-3">Something Went Wrong.</h2>
                <p className="secondary mb-3">
                    Your user data is missing! Please click the button below to fetch materials.
                    If this is a recurring problem, please submit an issue to Github.
                </p>
                <button className="rounded w-full p-5 bg-background dark:bg-background-dark shadow-lg" onClick={updateSgy}>
                    Fetch Materials
                </button>
            </>)}
        </ClassesErrorBurrito>
    )
    if (!userData.sgy?.custom || !userData.sgy?.custom.assignments || !userData.sgy?.custom.labels || !userData.sgy?.custom.modified)
        return <Loading /> // make sure user has all of these things :D, if not, usually gets corrected by FirebaseUserDataProvider

    return (
        <AppLayout>
            <SgyDataProvider value={{sgyData, fetching, lastFetched, lastAttemptedFetch, selected, updateSgy}}>
                <div className={"container py-4 md:py-6 " + screenType}>
                    <Wave />

                    <ClassesHeader selected={selected} setSelected={setSelected} />

                    <nav className="mt-3.5 md:mt-5 flex flex-wrap gap-2 mb-4 text-lg">
                        <ClassesNavBarItem text="Dashboard" to="/classes" />
                        <ClassesNavBarItem text="Upcoming" to="/classes/upcoming" />
                        <ClassesNavBarItem text="Materials" to="/classes/materials" />
                    </nav>

                    <main>
                        {props.children}
                    </main>
                </div>
            </SgyDataProvider>
        </AppLayout>
    )
}

function ClassesNavBarItem(props: {text: string, to: string}) {
    const {text, to} = props;

    const router = useRouter();
    const match = router.pathname === to;

    return (
        <Link href={to}>
            <a className={'py-2 px-3 rounded-md transition duration-100 ease-in-out flex-grow text-center hover:no-underline ' + (match ? 'text-primary dark:text-primary-dark bg-content dark:bg-content-dark shadow-lg' : 'secondary bg-content-secondary dark:bg-content-secondary-dark')}>
                {text}
            </a>
        </Link>
    )
}

// A wrapper that centers all the error messages
function ClassesErrorBurrito(props: {children?: ReactNode}) {
    return (
        <AppLayout>
            <Wave />
            <div className="w-full h-screen flex items-center justify-center pb-16 -mb-16 md:pb-0 md:mb-0">
                <div className="max-w-5xl rounded p-6 mx-4 text-center bg-sidebar dark:bg-sidebar-dark">
                    {props.children}
                </div>
            </div>
        </AppLayout>
    )
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
