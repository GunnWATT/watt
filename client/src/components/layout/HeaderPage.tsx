import {ReactNode} from 'react';
import RedBackground from '../layout/RedBackground';


type HeaderPageProps = {heading: string, nav: ReactNode, children: ReactNode, other?: ReactNode};
export default function HeaderPage(props: HeaderPageProps) {
    const {heading, nav, children, other} = props;

    return (
        <>
            <RedBackground />

            <div className="container py-4 md:py-6">
                <Header>
                    <h1 className="mb-0">{heading}</h1>
                    {other}
                </Header>
                <nav className="mt-6 flex flex-wrap">
                    {nav}
                </nav>
                <main className="flex flex-col p-5 bg-[color:var(--content-primary)] rounded-b-lg shadow-lg">
                    {children}
                </main>
            </div>
        </>
    );
}

export function Header(props: {children: ReactNode}) {
    return (
        <header className="px-5 py-3 flex items-center gap-4 text-white bg-theme dark:bg-theme-dark rounded-lg shadow-lg">
            {props.children}
        </header>
    )
}
