import {ReactNode} from 'react';
import RedBackground from '../layout/RedBackground';


type HeaderPageProps = {heading: string, nav: ReactNode, children: ReactNode, other?: ReactNode};
export default function HeaderPage(props: HeaderPageProps) {
    const {heading, nav, children, other} = props;

    return (
        <>
            <RedBackground />

            <div className="header-background py-4 md:py-6 container">
                <header className="px-5 py-3 flex items-center gap-4 text-white bg-theme dark:bg-theme-dark rounded-lg shadow-lg">
                    <h1 className="mb-0">{heading}</h1>
                    {other}
                </header>
                <nav className="mt-6 flex flex-wrap">
                    {nav}
                </nav>
                <main className="page">
                    {children}
                </main>
            </div>
        </>
    );
}
