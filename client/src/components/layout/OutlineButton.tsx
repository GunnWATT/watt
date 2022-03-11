import {MouseEventHandler, ReactNode} from 'react';


// TODO: these outline buttons look good, but perhaps a fancy gradiented fill button a la the one in the original
// landing page for elimination would be better in certain cases?
// TODO: style :focus better, think about :hover text color / styles
type OutlineButtonProps = {
    children: ReactNode, onClick?: MouseEventHandler<HTMLButtonElement>,
    disabled?: boolean
};
export default function OutlineButton(props: OutlineButtonProps) {
    const {children, ...buttonProps} = props;

    return (
        <button className="secondary border border-secondary dark:border-secondary-dark hover:bg-secondary/50 dark:hover:bg-secondary-dark/50 rounded px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/50 dark:focus-visible:ring-secondary-dark/50" {...buttonProps}>
            {children}
        </button>
    )
}

export function DangerOutlineButton(props: OutlineButtonProps) {
    const {children, ...buttonProps} = props;

    return (
        <button className="text-theme dark:text-theme-dark border border-theme dark:border-theme-dark hover:bg-theme/50 dark:hover:bg-theme-dark/50 px-3 py-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-theme/50 dark:focus-visible:ring-theme-dark/50" {...buttonProps}>
            {children}
        </button>
    )
}

export function SuccessOutlineButton(props: OutlineButtonProps) {
    const {children, ...buttonProps} = props;

    return (
        <button className="text-lime-600 border border-lime-600 hover:bg-lime-600/50 px-3 py-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-600/50" {...buttonProps}>
            {children}
        </button>
    )
}
