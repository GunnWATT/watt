import {Fragment, useState, useEffect} from 'react';
import {Dialog, Transition} from '@headlessui/react';
import {PlusSquare, Share} from 'react-feather';


export default function InstallModal() {
    // TODO: ideally we customize our installation flow, but browser support is quite poor for that
    // Leaving this here as a "maybe in the future when support improves": https://web.dev/customize-install/
    /*
    const [prompt, setPrompt] = useState<BeforeInstallPromptEvent>(null);

    useEffect(() => {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            setPrompt(e);
        });
    }, [])
    */

    // Display the modal if the user is on iOS and not running in standalone mode
    // @ts-ignore
    const [isOpen, setIsOpen] = useState((/iPad|iPod|iPhone/).test(navigator.userAgent) && !navigator.standalone);

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed z-20 inset-0 flex flex-col items-center justify-end">
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Dialog.Overlay className="fixed inset-0 bg-black/40" />
                </Transition.Child>

                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-12"
                    enterTo="opacity-100 translate-y-0"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-12"
                >
                    <div className="relative flex flex-col bg-content dark:bg-content-dark rounded-t-2xl max-w-md max-h-[80%] mx-3 pt-6 px-6 shadow-xl">
                        <img
                            src="/home_screen.jpg"
                            alt="Home screen icon"
                            className="absolute rounded-3xl h-24 w-24 -top-10 left-0 right-0 mx-auto"
                        />
                        <h3 className="text-lg font-semibold mt-9">
                            It looks like you're using WATT in the iOS Safari app.
                        </h3>
                        <hr className="my-3" />
                        <section className="overflow-scroll scroll-smooth scrollbar-none pb-6">
                            <p className="mb-3">WATT is best experienced when installed as a PWA.</p>
                            <p className="mb-3">To add WATT to your home screen,</p>
                            <ol className="list-decimal list-inside space-y-1 mb-3">
                                <li>Tap the share button <Share className="inline h-6 w-6 p-1 bg-content-secondary dark:bg-content-secondary-dark rounded-md" />.</li>
                                <li>Select <strong>"Add to Home Screen"</strong> in the bottom row.</li>
                                <div className="p-2 bg-content-secondary dark:bg-content-secondary-dark rounded-lg">
                                    <span className="flex items-center justify-between text-sm font-light p-3 bg-content dark:bg-content-dark rounded-lg">
                                        Add to Home Screen
                                        <PlusSquare className="h-[1.1rem] w-[1.1rem]" />
                                    </span>
                                </div>
                                <li>In the dialogue, tap <strong>"Add"</strong>.</li>
                            </ol>
                            <p className="secondary text-sm">
                                Not interested?{' '}
                                <button onClick={() => setIsOpen(false)} className="font-semibold focus:outline-none focus:underline">Dismiss.</button>
                            </p>
                        </section>
                    </div>
                </Transition.Child>
            </Dialog>
        </Transition>
    )
}
