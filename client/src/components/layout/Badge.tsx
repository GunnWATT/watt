import {ReactNode} from 'react';


type BadgeProps = {children: ReactNode};
export default function Badge(props: BadgeProps) {
    return (
        <span className="rounded-full text-white bg-theme dark:bg-theme-dark text-base h-max px-2">
            {props.children}
        </span>
    )
}
