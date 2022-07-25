import { useState, useEffect, useContext } from 'react';

// Contexts
import UserDataContext from '../../contexts/UserDataContext';
import AlternatesContext from '../../contexts/AlternatesContext';

// Utilities
import { cardinalize } from '../../util/sgyHelpers';
import { ClassPeriodQuickInfo, pastClasses, nextSchoolDay, numSchoolDays } from '../../util/sgyPeriodFunctions';


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
        const next = nextSchoolDay(userData, alternates);
        return (
            <section>
                <h2 className="text-xl">
                    {next ? (<>
                        The next school day is {next.toRelative()}.
                    </>) : (<>
                        The school year has ended!
                    </>)}
                </h2>
                <p className="secondary">
                    There have been {numSchoolDays(alternates)} school days in this school year.
                </p>
            </section>
        )
    }

    if (!info) return null;

    if (!info.next) return (
        <section>
            <h2 className="text-xl">There have been {info.past.days} classes in this school year.</h2>
        </section>
    )

    return (
        <section>
            <h2 className="text-xl">The next class is {info.next.time.toRelative()}.</h2>
            <p className="secondary">
                It will be on {info.next.time.toFormat('dddd, MMMM Do')}, and will be Week {info.next.week} Day {info.next.day},
                the {cardinalize(info.past.days + 1)} class of the school year.
            </p>
        </section>
    )
}
