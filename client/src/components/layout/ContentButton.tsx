import {MouseEventHandler, ReactNode} from 'react';


// A filled content-colored button, as seen in the Classes tab. These are contrast colored by default and
// `content-secondary` colored when hovered.
export default function ContentButton(props: {children: ReactNode, onClick?: MouseEventHandler<HTMLButtonElement>}) {
    return (
        <button className="px-4 py-1.5 bg-background dark:bg-content-dark hover:bg-content-secondary dark:hover:bg-content-secondary-dark rounded h-max transition duration-100" onClick={props.onClick}>
            {props.children}
        </button>
    )
}
