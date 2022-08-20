import {ReactNode} from 'react';


type BadgeProps = {children: ReactNode};
export default function Badge(props: BadgeProps) {
    return (
        <span className="rounded-full text-white font-bold bg-theme shadow shadow-red-700/40 text-sm h-max px-1.5 pb-0.5 ml-2.5">
            {props.children}
        </span>
    )
}
