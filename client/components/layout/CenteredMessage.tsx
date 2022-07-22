import {ReactNode} from 'react';


export default function CenteredMessage(props: {children: ReactNode}) {
    return (
        <div className="secondary flex flex-col flex-grow text-center items-center justify-center h-full min-h-[300px]">
            <span className="flex flex-col gap-3">
                {props.children}
            </span>
        </div>
    )
}
