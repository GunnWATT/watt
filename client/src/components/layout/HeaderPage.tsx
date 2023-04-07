import {ReactNode} from 'react';
import Wave from './Wave';


type HeaderPageProps = {heading: string, nav: ReactNode, children: ReactNode, other?: ReactNode};
export default function HeaderPage(props: HeaderPageProps) {
    const {heading, nav, children, other} = props;

    return (
        <>
            <Wave />

            <div className="container py-3.5 md:py-6">
                <Header>
                    <h1 className="text-4xl font-semibold">{heading}</h1>
                    {other}
                </Header>
                <nav className="mt-3.5 md:mt-5 flex flex-wrap">
                    {nav}
                </nav>
                <main className="relative px-5 md:px-6 py-4 md:py-5 bg-content rounded-b-lg shadow-lg">
                    {children}
                </main>
            </div>
        </>
    );
}

export function Header(props: {children: ReactNode}) {
    return (
        <header className="px-5 py-3 flex items-center gap-4 text-white bg-gradient-to-r from-theme to-theme-secondary rounded-lg shadow-lg shadow-theme-tertiary/40">
            {props.children}
        </header>
    )
}

export function SectionHeader(props: {children: ReactNode, className?: string}) {
    return (
        <h2 className={'text-3xl font-medium' + (props.className ? ` ${props.className}` : '')}>
            {props.children}
        </h2>
    )
}
