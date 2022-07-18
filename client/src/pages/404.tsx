import {Link} from 'react-router-dom';


export default function PageNotFound() {
    return (
        <div className="h-screen flex items-center justify-center">
            <main className="max-w-prose p-8">
                <h1 className="text-5xl font-bold underline decoration-theme dark:decoration-theme-dark mb-4">
                    404.
                </h1>
                <p className="secondary mb-1">
                    Your requested page was not found. Check your URL and try again?
                </p>
                <Link to="/">Go home</Link>
            </main>
        </div>
    )
}
