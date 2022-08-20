import {Fragment, ReactNode} from 'react';
import {Dialog, Transition} from '@headlessui/react';


// A reusable component to wrap a transition and dialog overlay around a screen-centered div.
type CenteredModalProps = {
    isOpen: boolean, setIsOpen: (isOpen: boolean) => void,
    className: string, children: ReactNode
}
export default function CenteredModal(props: CenteredModalProps) {
    const {isOpen, setIsOpen, className, children} = props;

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog onClose={() => setIsOpen(false)} className="fixed z-50 inset-0 flex items-center justify-center">
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/40" />
                </Transition.Child>

                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                >
                    <Dialog.Panel className={className}>
                        {children}
                    </Dialog.Panel>
                </Transition.Child>
            </Dialog>
        </Transition>
    )
}
