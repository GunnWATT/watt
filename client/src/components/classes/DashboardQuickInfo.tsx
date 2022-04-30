import { useState, useEffect, useContext } from 'react';

// Contexts
import UserDataContext from '../../contexts/UserDataContext';

// Utilities
import { cardinalize } from '../../util/sgyHelpers';
import { ClassPeriodQuickInfo, pastClasses, nextSchoolDay, numSchoolDays } from '../../util/sgyPeriodFunctions';
import AlternatesContext from "../../contexts/AlternatesContext";


// Quick Info includes when's the next day that has a given period
// It also tells you what week/day it will be
// TODO: fix on day of
export default function DashboardQuickInfo(props: { selected: string }) {
    const { selected } = props;
    const [info, setInfo] = useState<ClassPeriodQuickInfo | null>(null);

    const userData = useContext(UserDataContext);
    const {alternates} = useContext(AlternatesContext);

    useEffect(() => {
        if (selected !== 'A') setInfo(pastClasses(selected, alternates));
    }, [selected]);

    if (selected === 'A') {
        return (
            <section>
                <div className="dashboard-qi-main">The next school day is {nextSchoolDay(userData, alternates)?.toRelative()}.</div>
                <div className="secondary">There have been {numSchoolDays(alternates)} school days in this school year.</div>
            </section>
        )
    }

    if (!info) return null;

    if (!info.next) return (
        <section>
            <div className="dashboard-qi-main">There have been {info.past.days} classes in this school year.</div>
        </section>
    )

    return (
        <section>
            <div className="dashboard-qi-main">The next class is {info.next.time.toRelative()}.</div>
            <div className="dashboard-qi-note secondary">
                It will be on {info.next.time.toFormat('dddd, MMMM Do')}, and will be Week {info.next.week} Day {info.next.day},
                the {cardinalize(info.past.days + 1)} class of the school year.
            </div>
        </section>
    )
}
