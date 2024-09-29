import { createContext } from 'react';


export type Entry = {
    serving?: {
        serving_size_amount: string,
        serving_size_unit: string
    },
    nutrition?: {
        calories?: number,
        g_fat?: number,
        g_saturated_fat?: number,
        g_trans_fat?: number,
        mg_cholesterol?: number,
        g_carbs?: number,
        g_added_sugar?: number,
        g_sugar?: number,
        mg_potassium?: number,
        mg_sodium?: number,
        g_fiber?: number,
        g_protein?: number,
        mg_iron?: number,
        mg_calcium?: number,
        mg_vitamin_c?: number,
        iu_vitamin_a?: number,
        re_vitamin_a?: number,
        mcg_vitamin_a?: number,
        mg_vitamin_d?: number,
        mcg_vitamin_d?: number,
    },
    ingredients?: string
}

export type Menu = {
    timestamp: string,
    menu: {
        [date: string]: {
            brunch: { [item: string]: Entry },
            lunch: { [item: string]: Entry }
        }
    }
}

export const defaultMenu: Menu = {
    timestamp: new Date().toISOString(),
    menu: {}
}

const MenuContext = createContext<Menu>(defaultMenu);

export const MenuProvider = MenuContext.Provider;
export default MenuContext;