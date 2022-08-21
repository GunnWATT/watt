import {ReactNode} from 'react';


export default function Loading(props: { children?: ReactNode }) {
    return (
        <div className="text-secondary flex items-center gap-3">
            <Spinner />
            <span>{props.children || 'Loading content...'}</span>
        </div>
    )
}

export function Spinner() {
    return (
        <div className="h-6 w-6 rounded-full border-[0.25rem] border-secondary border-r-transparent animate-spin">
            <span className="sr-only">Loading...</span>
        </div>
    )
}
