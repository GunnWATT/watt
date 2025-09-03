import { ReactNode, useState } from 'react';

// Components
import { SectionHeader } from '../../components/layout/HeaderPage';
import CenteredModal from '../../components/layout/CenteredModal';
import CloseButton from '../../components/layout/CloseButton';
import Phone from '../../components/wellness/PhoneNumber';
import Presentation from '../../components/wellness/Presentation';
import Website from '../../components/wellness/Website';
import SupportOthers from '../../components/wellness/SupportOthers';

export default function Wellness() {
    return (
        <>
            <SectionHeader className="mb-5">Wellness</SectionHeader>
            <section className="flex flex-col gap-3">
                <ArticleCard name="Crisis Support" element={<Phone />}>
                    Resources for students in crisis.
                </ArticleCard>
                <ArticleCard name="Support Others" element={<SupportOthers />}>
                    Resources to support someone in crisis.
                </ArticleCard>
                <ArticleCard name="Student's Guide To Safety" element={<Presentation />}>
                    By Gunn High School Wellness Center
                </ArticleCard>
                <ArticleCard name="Mental Health Resources" element={<Website />}>
                    Online resources for mental health support.
                </ArticleCard>
            </section>
        </>
    );
}

type ArticleCardProps = { name: string, element: JSX.Element, children: ReactNode };
function ArticleCard(props: ArticleCardProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className="flex items-center gap-4 rounded-lg shadow-md px-5 py-4 cursor-pointer bg-gray-100 dark:bg-background hover:bg-gray-50/50 dark:hover:bg-content-secondary transition duration-200" onClick={() => setIsOpen(true)}>
                <h3>{props.name}</h3>
                <p className="font-light">
                    {props.children}
                </p>
            </div>

            <CenteredModal className="relative p-6 md:py-7 md:px-8 mx-2 bg-content rounded-lg shadow-xl box-content max-w-prose max-h-[90%] overflow-y-auto scrollbar-none" isOpen={isOpen} setIsOpen={setIsOpen}>
                <CloseButton className="absolute top-4 right-4 md:right-6" onClick={() => setIsOpen(false)} />
                {props.element}
            </CenteredModal>
        </>
    )
}