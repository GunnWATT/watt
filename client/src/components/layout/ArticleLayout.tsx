import {ReactNode} from 'react';
import {Link, Outlet} from 'react-router-dom';


// The layout for the articles subpages.
export default function ArticleLayout() {
    return (
        <div className="container pt-24">
            <main className="px-4">
                <Link to="/utilities/articles" className="block text-sm secondary text-inherit hover:no-underline -ml-4 mb-8">
                    ← Return to utilities
                </Link>
                <Outlet />
            </main>
        </div>
    )
}

export function ArticleHeader(props: {children: ReactNode}) {
    return (
        <h1 className="text-4xl font-bold underline decoration-theme dark:decoration-theme-dark mb-6 pr-6">
            {props.children}
        </h1>
    )
}
