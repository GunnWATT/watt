import {Fragment, ReactNode} from 'react';
import {Listbox, Transition} from '@headlessui/react';


// A reusable component to wrap a "dropdown" animation around a `Listbox.Options`.
export default function AnimatedListbox(props: {children: ReactNode, className?: string}) {
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
            <Listbox.Options className={props.className}>
                {props.children}
            </Listbox.Options>
        </Transition>
    )
}
