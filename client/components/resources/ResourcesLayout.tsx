import {ReactNode} from 'react';
import Link from 'next/link';


// The layout for the resources subpages.
export default function ResourcesLayout(props: {children: ReactNode}) {
    return (
        <div className="container pt-24">
            <main className="px-4">
                <Link href="/utilities">
                    <a className="block text-sm secondary text-inherit hover:no-underline -ml-4 mb-8">
                        ← Return to utilities
                    </a>
                </Link>
                {props.children}
            </main>
        </div>
    )
}
