import {Fragment, ReactNode} from 'react';
import {Popover, Transition} from '@headlessui/react';


// A reusable component to wrap a "dropdown" animation around a `Popover.Panel`.
export default function AnimatedPopover(props: {children: ReactNode, className?: string}) {
    return (
        <Transition
            as={Fragment}
            enter="transition duration-150 ease-out"
            enterFrom="scale-95 opacity-0"
            enterTo="scale-100 opacity-100"
            leave="transition duration-100 ease-out"
            leaveFrom="scale-100 opacity-100"
            leaveTo="scale-95 opacity-0"
        >
            <Popover.Panel className={props.className}>
                {props.children}
            </Popover.Panel>
        </Transition>
    )
}
