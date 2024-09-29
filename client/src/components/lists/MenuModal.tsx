import { useState } from 'react';
import { Dialog } from '@headlessui/react';

import NutritionModal from './NutritionModal';
import CenteredModal from '../layout/CenteredModal';
import { DangerOutlineButton } from '../layout/OutlineButton';

import type { Entry } from '../../contexts/MenuContext';


type MenuModalProps = {
    name: string,
    items: { [item: string]: Entry },
    isOpen: boolean,
    setIsOpen: (open: boolean) => void
}
export default function MenuModal(props: MenuModalProps) {
    const { name, items, isOpen, setIsOpen } = props;
    const [nutritionModal, setNutritionModal] = useState<string | null>(null);

    return (
        <CenteredModal className="relative flex flex-col bg-content rounded-md w-[28rem] max-h-[90%] mx-2 p-6 shadow-xl" isOpen={isOpen} setIsOpen={setIsOpen}>
            <Dialog.Title className="text-xl font-semibold mb-3 pr-6">
                {name} Menu
            </Dialog.Title>

            <section className="mb-4 space-y-1 overflow-scroll scroll-smooth scrollbar-none">
                {Object.entries(items).map(([item, nutrition]) => (
                    <div key={item}>
                        <div
                            className="truncate text-center cursor-pointer px-8 py-4 text-secondary rounded-md bg-black/10 dark:bg-black/20 hover:bg-black/20 dark:hover:bg-black/30 transition duration-75"
                            onClick={() => nutrition && setNutritionModal(item)}
                        >
                            {item}
                        </div>
                        {nutrition && (
                            <NutritionModal
                                item={item}
                                nutrition={nutrition}
                                isOpen={(nutritionModal === item)}
                                setIsOpen={() => setNutritionModal(null)}
                            />
                        )}
                    </div>
                ))}
            </section>

            <section className="flex gap-3 flex-wrap justify-end">
                <DangerOutlineButton onClick={() => setIsOpen(false)}>
                    Close
                </DangerOutlineButton>
            </section>
        </CenteredModal>
    )
}
