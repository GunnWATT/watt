import admin from './util/adminInit';

import { DateTime } from 'luxon';
import { onSchedule } from 'firebase-functions/v2/scheduler';

import { SCHOOL_START, SCHOOL_END } from '@watt/shared/data/schedule';
import type { Menu } from '@watt/client/src/contexts/MenuContext';


const now = DateTime.now();
const { year, month } = now.plus({ week: 1 });

const firestore = admin.firestore();

async function getDays(start: number, meal: 'breakfast' | 'lunch') {
    return await fetch(`https://pausd.api.nutrislice.com/menu/api/weeks/school/henry-m-gunn-hs/menu-type/${meal}/${year}/${month}/${start}`)
        .then(res => res.json())
        .then(data => data.days);
}

async function setDays(menu: Menu['menu'], days: any, meal: 'brunch' | 'lunch') {
    for (const { date, menu_items } of days) {
        if (!menu_items.length) continue;

        const items = menu_items
            .filter((items: any) => items.food)
            .map(({ food }: any) => {
                return [
                    food.name,
                    {
                        serving: food.serving_size_info,
                        nutrition: food.rounded_nutrition_info,
                        ingredients: food.ingredients
                    }
                ]
            });

        if (!items.length) continue;

        const formatted = date.slice(5);
        const day = menu[formatted] = menu[formatted] || { brunch: {}, lunch: {} };

        day[meal] = Object.fromEntries(items);
    }
}

async function getMenu(menu: Menu['menu'], start: number) {
    const [brunch, lunch] = await Promise.all([
        getDays(start, 'breakfast'),
        getDays(start, 'lunch')
    ]);

    setDays(menu, brunch, 'brunch');
    setDays(menu, lunch, 'lunch');

    const final = DateTime.max(
        DateTime.fromISO(brunch[brunch.length - 1].date),
        DateTime.fromISO(lunch[lunch.length - 1].date)
    );

    if (final.month === month)
        await getMenu(menu, final.day + 1);

    return menu;
}

export const menu = onSchedule("every day 00:00", async () => {
    if (now < SCHOOL_START || SCHOOL_END < now) {
        await firestore.collection('gunn').doc('menu').set({
            timestamp: new Date().toISOString(),
            menu: {}
        });
        return;
    }

    const menu: Menu['menu'] = {};
    await getMenu(menu, 1);

    const current = (await firestore.collection('gunn').doc('menu').get()).data()!;

    await firestore.collection('gunn').doc('menu').set({
        timestamp: new Date().toISOString(),
        menu: { ...current.menu, ...menu }
    });
});