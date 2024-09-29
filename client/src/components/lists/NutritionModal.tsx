import { ReactNode } from 'react';
import { Dialog } from '@headlessui/react';

import CenteredModal from '../layout/CenteredModal';
import { DangerOutlineButton } from '../layout/OutlineButton';

import type { Entry } from '../../contexts/MenuContext';


type ItemProps = {
    children: ReactNode,
    value?: number,
    dv?: number
}
function Item(props: ItemProps) {
    const { children, value, dv } = props;

    if (value === null)
        return <></>

    return (
        <>
            <hr className="my-0.5 opacity-50" />
            <div className="flex justify-between">
                {children}
                {dv && <strong>{Math.floor((value! / dv) * 100)}%</strong>}
            </div>
        </>
    )
}

type NutritionModalProps = {
    item: string,
    nutrition: Entry,
    isOpen: boolean,
    setIsOpen: (open: boolean) => void
}
export default function NutritionModal(props: NutritionModalProps) {
    const {
        item,
        nutrition: {
            serving,
            nutrition,
            ingredients
        },
        isOpen,
        setIsOpen
    } = props;

    return (
        <CenteredModal className="relative flex flex-col bg-content rounded-md w-[28rem] max-h-[90%] mx-2 p-6 shadow-xl" isOpen={isOpen} setIsOpen={setIsOpen}>
            <Dialog.Title className="text-xl font-semibold mb-3 pr-6">
                {item}
            </Dialog.Title>

            <section className="mb-4 py-2 px-4 rounded-md overflow-scroll scroll-smooth scrollbar-none text-secondary bg-black/10 dark:bg-black/20">
                {nutrition ? (
                    <>
                        <strong className="text-2xl">Nutrition Facts</strong>
                        <hr className="my-0.5" />
                        {serving && serving.serving_size_amount && serving.serving_size_unit && (
                            <>
                                <div className="flex justify-between space-x-8">
                                    <strong>Serving size</strong>
                                    <strong>{serving.serving_size_amount} {serving.serving_size_unit}</strong>
                                </div>
                                <hr className="my-0.5" />
                            </>
                        )}
                        {nutrition.calories && (
                            <>
                                <div className="flex justify-between text-xl">
                                    <strong>Calories</strong>
                                    <strong>{nutrition.calories}</strong>
                                </div>
                                <hr className="my-0.5" />
                            </>
                        )}
                        <div className="flex justify-end">
                            <strong className="text-right">% Daily Value*</strong>
                        </div>

                        <Item value={nutrition.g_fat} dv={78}>
                            <p><strong>Total Fat</strong> {nutrition.g_fat}g</p>
                        </Item>
                        <Item value={nutrition.g_saturated_fat} dv={20}>
                            <p className="ml-4">Saturated Fat {nutrition.g_saturated_fat}g</p>
                        </Item>
                        <Item value={nutrition.g_trans_fat}>
                            <p className="ml-4"><i>Trans</i> Fat {nutrition.g_trans_fat}g</p>
                        </Item>

                        <Item value={nutrition.mg_cholesterol} dv={300}>
                            <p><strong>Cholesterol</strong> {nutrition.mg_cholesterol}mg</p>
                        </Item>

                        <Item value={nutrition.mg_sodium} dv={2300}>
                            <p><strong>Sodium</strong> {nutrition.mg_sodium}mg</p>
                        </Item>

                        <Item value={nutrition.g_carbs} dv={275}>
                            <p><strong>Total Carbohydrate</strong> {nutrition.g_carbs}g</p>
                        </Item>
                        <Item value={nutrition.g_fiber} dv={28}>
                            <p className="ml-4">Dietary Fiber {nutrition.g_fiber}g</p>
                        </Item>
                        <Item value={nutrition.g_sugar}>
                            <p className="ml-4">Total Sugars {nutrition.g_sugar}g</p>
                        </Item>
                        <Item value={nutrition.g_added_sugar} dv={50}>
                            <p className="ml-8">Includes {nutrition.g_added_sugar}g Added Sugars</p>
                        </Item>

                        <Item value={nutrition.g_protein} dv={50}>
                            <p><strong>Protein</strong> {nutrition.g_protein}g</p>
                        </Item>

                        <Item>
                            <p className="text-sm font-light">
                                * Percent Daily Values are based on a 2,000 calorie diet.
                            </p>
                        </Item>
                    </>
                ) : (
                    <p>No nutrition information available.</p>
                )}

                {ingredients && (
                    <>
                        <hr className="mt-0.5 mb-1" />
                        <strong className="text-2xl">Ingredients</strong>
                        <p>{ingredients}</p>
                    </>
                )}
            </section>

            <section className="flex gap-3 flex-wrap justify-end">
                <DangerOutlineButton onClick={() => setIsOpen(false)}>
                    Close
                </DangerOutlineButton>
            </section>
        </CenteredModal>
    )
}
