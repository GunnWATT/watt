import Link from 'next/link';


export default function PageNotFound() {
    return (
        <div className="404">
            <h3>Page not found! Check your URL and try again?</h3>
            <Link href="/"><a>Go home</a></Link>
        </div>
    )
}
