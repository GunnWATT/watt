import { useContext } from 'react';
import {Disclosure} from '@headlessui/react';
import { FiChevronDown, FiChevronRight, FiChevronUp } from 'react-icons/all';

// Components
import Dot from '../layout/Dot';

// Context
import SgyDataContext from '../../contexts/SgyDataContext';


type GradesProps = { selected: string, allGrades: { [key: string]: number } };
export default function Grades(props: GradesProps) {
    const { allGrades, selected } = props;
    const { classes } = useContext(SgyDataContext);

    if (selected !== 'A' && !allGrades[selected]) return null;

    return (
        <Disclosure as="section">
            {({open}) => (<>
                <Disclosure.Button className="flex gap-2 items-end text-3xl font-semibold my-3">
                    Grades
                    <FiChevronRight size={28} className={'cursor-pointer transition duration-150' + (open ? ' rotate-90' : '')} />
                </Disclosure.Button>

                <Disclosure.Panel className="flex flex-col gap-2 px-4 py-3 rounded-lg bg-content-secondary/50 mb-4">
                    {selected === 'A' ? classes
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
                    <p className="text-secondary text-sm font-light">
                        Percent grades may not be indicative of your actual letter grade in the class. If your teacher
                        does not use a percent-based scale, check Schoology for your correct grade.
                    </p>
                </Disclosure.Panel>
            </>)}
        </Disclosure>
    )
}
