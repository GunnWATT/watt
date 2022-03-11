import {MouseEventHandler} from 'react';


type CloseButtonProps = {className?: string, onClick?: MouseEventHandler<HTMLButtonElement>}
export default function CloseButton(props: CloseButtonProps) {
    const {className, onClick} = props;

    return (
        <button
            type="button"
            className={'close text-2xl font-bold px-2 pb-1.5 opacity-50 hover:opacity-75' + (className ? ' ' + className : '')}
            aria-label="Close"
            onClick={onClick}
        >
            <span aria-hidden>×</span>
        </button>
    )
}
