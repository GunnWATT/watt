import {MouseEventHandler, ReactNode} from 'react';


// A general purpose outline button for use primarily in modals. `OutlineButton` is the default, `secondary` colored
// button, while `DangerOutlineButton` is `theme` colored and `SuccessOutlineButton` is green. All outline buttons are
// outlines by default and filled when hovered.
// TODO: disabled styles
type OutlineButtonProps = {
    children: ReactNode, onClick?: MouseEventHandler<HTMLButtonElement>,
    disabled?: boolean
};
export default function OutlineButton(props: OutlineButtonProps) {
    const {children, ...buttonProps} = props;

    return (
        <button className="secondary border border-secondary dark:border-secondary-dark hover:text-white hover:dark:text-white hover:bg-[#9c9ca2] hover:dark:bg-[#717173] hover:shadow-lg hover:shadow-gray-500/40 dark:hover:shadow-zinc-800/40 hover:border-transparent dark:hover:border-transparent rounded px-3 py-2 transition-shadow duration-100 focus:outline-none focus-visible:ring-[3px] focus-visible:ring-secondary/50 dark:focus-visible:ring-secondary-dark/50" {...buttonProps}>
            {children}
        </button>
    )
}

export function DangerOutlineButton(props: OutlineButtonProps) {
    const {children, ...buttonProps} = props;

    return (
        <button className="text-theme dark:text-theme-dark border border-theme dark:border-theme-dark hover:text-white hover:dark:text-white hover:bg-gradient-to-br hover:from-theme hover:to-red-700 hover:dark:from-red-500 hover:dark:to-[#eb144c] hover:shadow-lg hover:shadow-red-700/40 hover:border-transparent dark:hover:border-transparent px-3 py-2 rounded transition-shadow duration-100 focus:outline-none focus-visible:ring-[3px] focus-visible:ring-theme/50 dark:focus-visible:ring-theme-dark/50" {...buttonProps}>
            {children}
        </button>
    )
}

export function SuccessOutlineButton(props: OutlineButtonProps) {
    const {children, ...buttonProps} = props;

    return (
        <button className="text-lime-600 border border-lime-600 hover:text-white hover:dark:text-white hover:bg-gradient-to-br hover:from-[#74bd0f] hover:to-lime-600 hover:dark:from-lime-600 hover:dark:to-[#578e0b] hover:shadow-lg hover:shadow-lime-800/40 hover:border-transparent dark:hover:border-transparent rounded px-3 py-2 transition-shadow duration-100 focus:outline-none focus-visible:ring-[3px] focus-visible:ring-lime-600/50" {...buttonProps}>
            {children}
        </button>
    )
}
