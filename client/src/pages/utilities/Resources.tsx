import {ReactNode, useState} from 'react';

// Components
import CenteredModal from '../../components/layout/CenteredModal';
import CloseButton from '../../components/layout/CloseButton';
import NYTimes from '../../components/resources/NYTimes';
import Support from '../../components/resources/Support';


export default function Resources() {
    return (
        <>
            <h1 className="mb-6">Resources</h1>
            <section className="flex flex-col gap-3">
                <ArticleCard name="New York Times" element={<NYTimes />}>
                    Instructions for how to register for a free New York Times subscription.
                </ArticleCard>
                <ArticleCard name="Crisis Support" element={<Support />}>
                    Resources for students in crisis.
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
            <div className="flex items-center gap-4 rounded-lg shadow-md px-5 py-4 cursor-pointer bg-gray-100 dark:bg-background-dark hover:bg-gray-50/50 dark:hover:bg-content-secondary-dark transition duration-200" onClick={() => setIsOpen(true)}>
                <h3>{props.name}</h3>
                <p className="font-light">
                    {props.children}
                </p>
            </div>

            <CenteredModal className="relative p-6 md:py-7 md:px-8 mx-2 bg-content dark:bg-content-dark rounded-lg shadow-xl max-h-[90%] overflow-y-auto scrollbar-none" isOpen={isOpen} setIsOpen={setIsOpen}>
                <CloseButton className="absolute top-4 right-4 md:right-6" onClick={() => setIsOpen(false)} />
                {props.element}
            </CenteredModal>
        </>
    )
}
