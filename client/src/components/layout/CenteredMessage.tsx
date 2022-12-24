import {ReactNode} from 'react';


export default function CenteredMessage(props: {children: ReactNode}) {
    return (
        <div className="text-secondary flex flex-col flex-grow text-center items-center justify-center h-full min-h-[300px] px-4 py-3">
            <span className="flex flex-col items-center gap-1">
                {props.children}
            </span>
        </div>
    )
}
