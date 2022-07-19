import {ReactNode, useContext, useEffect, useState} from 'react';
import {Helmet} from 'react-helmet-async';

// Components
import DashboardBlurb from '../../components/classes/DashboardBlurb';
import DashboardQuickInfo from '../../components/classes/DashboardQuickInfo';
import Grades from '../../components/classes/Grades';
import FetchFooter from '../../components/classes/FetchFooter';

// Contexts
import CurrentTimeContext from '../../contexts/CurrentTimeContext';
import UserDataContext from '../../contexts/UserDataContext';
import SgyDataContext from '../../contexts/SgyDataContext';

// Utilities
import { AssignmentBlurb } from '../../util/sgyAssignments';
import { getUpcomingInfo } from '../../util/sgyMaterials';
import { getAllGrades } from '../../util/sgyGrades';


export default function Dashboard() {
    const {sgyData, selected, fetching, lastFetched, updateSgy} = useContext(SgyDataContext);

    const userData = useContext(UserDataContext);
    const time = useContext(CurrentTimeContext);

    //const lastFetchedTime = lastFetched && moment(lastFetched);

    const [upcoming, setUpcoming] = useState<AssignmentBlurb[] | null>(null);
    const [overdue, setOverdue] = useState<AssignmentBlurb[] | null>(null);
    const [allGrades, setAllGrades] = useState<{[key:string]: number} | null>(null);


    useEffect(() => {
        setAllGrades(getAllGrades(sgyData, userData));
    }, [sgyData])

    // TODO: precompute upcoming info for all classes
    useEffect(() => {
        const info = (getUpcomingInfo(sgyData, selected, userData, time));

        setUpcoming(info.upcoming);
        setOverdue(info.overdue);
    }, [selected, userData])

    return (
        <div className="flex gap-4 flex-wrap xl:flex-nowrap">
            <Helmet>
                <title>Dashboard | WATT</title>
                {/* TODO: make description better */}
                <meta name="description" content="A minimal Schoology dashboard to keep you up to speed with assignments and grades." />
            </Helmet>

            {/* Dashboard left section */}
            <DashboardSection>
                {upcoming && <DashboardBlurb upcoming={upcoming} selected={selected} />}
            </DashboardSection>

            {/* Dashboard right section */}
            <DashboardSection>
                <DashboardQuickInfo selected={selected} />
                {allGrades && <Grades selected={selected} allGrades={allGrades} />}
                <FetchFooter />
            </DashboardSection>
        </div>
    );
};

function DashboardSection(props: {children: ReactNode}) {
    return (
        <section className="basis-1/2 flex-grow p-4 rounded-md flex flex-col bg-sidebar dark:bg-sidebar-dark shadow-lg min-w-0">
            {props.children}
        </section>
    )
}
