import {ReactNode} from 'react';
import RedBackground from '../layout/RedBackground';


type HeaderPageProps = {heading: string, nav: ReactNode, children: ReactNode, other?: ReactNode};
export default function HeaderPage(props: HeaderPageProps) {
    const {heading, nav, children, other} = props;

    return (
        <>
            <RedBackground />

            {/* TODO: tailwind's container merely sets the max-width to the size of the current breakpoint, */}
            {/* unlike bootstrap's which leaves some breathing room (and has narrower breakpoints). */}
            {/* We'd probably be better off using the responsive modifiers and limiting max width ourselves */}
            <div className="header-background container">
                <header className="px-5 py-3 flex items-center gap-4 text-white bg-theme dark:bg-theme-dark rounded-lg shadow-lg">
                    <h1 className="mb-0">{heading}</h1>
                    {other}
                </header>
                <nav className="page-nav flex flex-wrap">
                    {nav}
                </nav>
                <main className="page">
                    {children}
                </main>
            </div>
        </>
    );
}
