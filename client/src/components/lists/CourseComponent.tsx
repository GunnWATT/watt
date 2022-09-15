import {useState} from 'react';
import {Dialog} from '@headlessui/react';
import {Course} from '@watt/shared/data/courses';

// Components
import CenteredModal from '../layout/CenteredModal';
import {DangerOutlineButton} from '../layout/OutlineButton';


export default function CourseComponent(props: Course) {
    const {names, section, credit, hw, grades, length, prereqs, recCourses, description, slos, notes} = props;
    const [modal, setModal] = useState(false);

    return (
        <>
            <li className="text-sm cursor-pointer px-4 py-5" onClick={() => setModal(true)}>
                {names.map(({title, cid}) => (
                    <p>{title} :: {cid}</p>
                ))}
                <p className="text-secondary">{section}</p>
                <p className="text-secondary">{credit}</p>
            </li>

            <CenteredModal className="relative flex flex-col bg-content rounded-md max-w-xl max-h-[90%] mx-2 p-6 shadow-xl" isOpen={modal} setIsOpen={setModal}>
                <Dialog.Title className="text-xl font-semibold mb-3 pr-6 flex flex-col">
                    {names.map(({title, cid}) => (
                        <p>{title} :: {cid}</p>
                    ))}
                </Dialog.Title>

                {/* Unlike `ClucComponent` where only the description is scrollable, the entire header and description */}
                {/* are scrollable for courses to prevent huge headers blocking out any space to read the description. */}
                <section className="mb-4 overflow-scroll scroll-smooth scrollbar-none">
                    <section className="flex gap-6 justify-between">
                        <div>
                            <p><strong className="text-secondary font-medium">Section:</strong> {section}</p>
                            <p><strong className="text-secondary font-medium">Credit:</strong> {credit}</p>
                            <p><strong className="text-secondary font-medium">Homework:</strong> {hw}</p>
                            {prereqs && <p><strong className="text-secondary font-medium">Prerequisite(s):</strong> {prereqs}</p>}
                            {recCourses && <p><strong className="text-secondary font-medium">Recommended prior course(s):</strong> {recCourses}</p>}
                        </div>
                        <div className="basis-1/3 text-right">
                            <p><strong className="text-secondary font-medium">Grades:</strong> {grades.join(', ')}</p>
                            {slos && <p><strong className="text-secondary font-medium">SLOs:</strong> {slos.join(', ')}</p>}
                            <p><strong className="text-secondary font-medium">Length:</strong> {length}</p>
                        </div>
                    </section>
                    <hr className="my-3" />

                    <Dialog.Description>{description}</Dialog.Description>
                    {notes && (
                        <div className="mt-2 flex flex-col gap-0.5">
                            {notes.map(note => (
                                <p className="italic text-secondary">{note}</p>
                            ))}
                        </div>
                    )}
                </section>

                <section className="flex gap-3 flex-wrap justify-end">
                    <DangerOutlineButton onClick={() => setModal(false)}>
                        Close
                    </DangerOutlineButton>
                </section>
            </CenteredModal>
        </>
    )
}
