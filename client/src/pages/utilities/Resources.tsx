import {ReactNode, useState} from 'react';

// Components
import {SectionHeader} from '../../components/layout/HeaderPage';
import CenteredModal from '../../components/layout/CenteredModal';
import CloseButton from '../../components/layout/CloseButton';
import NYTimes from '../../components/resources/NYTimes';
import Adobe from '../../components/resources/Adobe';
import LibraryCard from '../../components/resources/LibraryCard';


export default function Resources() {
    return (
        <>
            <SectionHeader className="mb-5">Resources</SectionHeader>
            <section className="flex flex-col gap-3">
                <ArticleCard name="New York Times" element={<NYTimes />}>
                    How to register for a free New York Times subscription.
                </ArticleCard>
                <ArticleCard name="Adobe" element={<Adobe />}>
                    How to access your free Adobe Creative Cloud subscription.
                </ArticleCard>
                <ArticleCard name="Library Card" element={<LibraryCard />}>
                    How to access your PAUSD-provided Palo Alto Library account.
                </ArticleCard>
            </section>
        </>
    );
}

type ArticleCardProps = {name: string, element: JSX.Element, children: ReactNode};
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
