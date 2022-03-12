import { useContext } from 'react';
import {Disclosure} from '@headlessui/react';

// Context
import UserDataContext from '../../contexts/UserDataContext';
import SgyDataContext from '../../contexts/SgyDataContext';

// Utilities
import { findClassesList } from '../../pages/Classes';
import { classifyGrade } from '../../util/sgyHelpers';

// Icons
import { ChevronDown, ChevronRight, ChevronUp } from 'react-feather';


type GradesProps = { selected: string, allGrades: { [key: string]: number } };
export default function Grades(props: GradesProps) {
    const { allGrades, selected } = props;

    const userData = useContext(UserDataContext);
    const { sgyData } = useContext(SgyDataContext);

    if (selected !== 'A' && !allGrades[selected]) return null;

    return (
        <Disclosure as="section">
            {({open}) => (<>
                <Disclosure.Button className="flex gap-2 items-end text-3xl font-semibold my-3">
                    Grades
                    {open ? (
                        <ChevronDown size={28} className="cursor-pointer" />
                    ) : (
                        <ChevronRight size={28} className="cursor-pointer" />
                    )}
                </Disclosure.Button>

                <Disclosure.Panel className="dashboard-grade flex flex-col gap-2 px-4 py-3 rounded-lg bg-content-secondary/50 dark:bg-content-secondary-dark/50">
                    {selected === 'A' ? findClassesList(sgyData, userData)
                        .filter(({ period }) => period !== 'A' && allGrades[period])
                        .map(({ name, color, period }) => (
                            <div key={period} className="dashboard-grade-all flex gap-3 items-center">
                                <div className="dashboard-grade-all-bubble" style={{ backgroundColor: color }}>{period}</div>
                                <div>{classifyGrade(allGrades[period])} • {allGrades[period]}% • {name}</div>
                            </div>
                        )
                    ) : (<>
                        Your grade is {classifyGrade(allGrades[selected])} • {allGrades[selected]}%.
                    </>)}
                </Disclosure.Panel>
            </>)}
        </Disclosure>
    )
}
