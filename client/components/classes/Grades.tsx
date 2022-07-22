import { useContext } from 'react';
import {Disclosure} from '@headlessui/react';
import { ChevronDown, ChevronRight, ChevronUp } from 'react-feather';

// Components
import Dot from '../layout/Dot';

// Context
import UserDataContext from '../../contexts/UserDataContext';
import SgyDataContext from '../../contexts/SgyDataContext';

// Utilities
import { findClassesList } from './ClassesLayout';
import { classifyGrade } from '../../util/sgyHelpers';


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

                <Disclosure.Panel className="flex flex-col gap-2 px-4 py-3 rounded-lg bg-content-secondary/50 dark:bg-content-secondary-dark/50 mb-4">
                    {selected === 'A' ? findClassesList(sgyData, userData)
                        .filter(({ period }) => period !== 'A' && allGrades[period])
                        .map(({ name, color, period }) => (
                            <div key={period} className="flex gap-3 items-center">
                                <Dot size={30} color={color}>
                                    {period}
                                </Dot>
                                <div className="overflow-ellipsis overflow-hidden whitespace-nowrap">
                                    {allGrades[period]}% • {name}
                                </div>
                            </div>
                        )
                    ) : (<>
                        Your grade is {allGrades[selected]}%.
                    </>)}
                    <p className="secondary text-sm font-light">
                        Percent grades may not be indicative of your actual letter grade in the class. If your teacher
                        does not use a percent-based scale, check Schoology for your correct grade.
                    </p>
                </Disclosure.Panel>
            </>)}
        </Disclosure>
    )
}
