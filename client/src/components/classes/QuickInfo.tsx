import { useState, useEffect, useContext } from 'react';
import UserDataContext from '../../contexts/UserDataContext';
import { cardinalize } from '../../util/sgyHelpers';
import { ClassPeriodQuickInfo, pastClasses, nextSchoolDay, numSchoolDays } from '../../util/sgyPeriodFunctions';


// Quick Info includes when's the next day that has a given period
// It also tells you what week/day it will be
// TODO: fix on day of
export default function DashboardQuickInfo(props: { selected: string }) {
    const { selected } = props;
    const [info, setInfo] = useState<ClassPeriodQuickInfo | null>(null);
    const userData = useContext(UserDataContext);

    useEffect(() => {
        if (selected !== 'A') setInfo(pastClasses(selected));
    }, [selected]);

    if (selected === 'A') {
        return <>
            <div className="dashboard-qi-main">The next school day is {nextSchoolDay(userData)?.fromNow()}.</div>
            <div>There have been {numSchoolDays()} school days in this school year.</div>
        </>
    }

    if (!info) return null;

    if (!info.next)
        return <div className="dashboard-qi-main">There have been {info.past.days} classes in this school year.</div>

    return <>
        <div className="dashboard-qi-main">The next class is {info.next.time.fromNow()}.</div>
        <div className="dashboard-qi-note">
            It will be on {info.next.time.format('dddd, MMMM Do')}, and will be Week {info.next.week} Day {info.next.day},
            the {cardinalize(info.past.days + 1)} class of the school year.
        </div>
    </>
}
