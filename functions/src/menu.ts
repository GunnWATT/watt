import * as functions from 'firebase-functions';
import admin from './util/adminInit';

import { DateTime } from 'luxon';
import { getAlternates } from './util/apiUtil';
import { getSchedule } from '@watt/shared/util/schedule';
import { SCHOOL_START, SCHOOL_END } from '@watt/shared/data/schedule';


const firestore = admin.firestore();

export const menu = functions.https.onCall(async () => {
    const now = DateTime.now().setZone('America/Los_Angeles');

    if (now < SCHOOL_START || now > SCHOOL_END) {
        await firestore.collection('gunn').doc('menu').set({
            timestamp: new Date().toISOString(),
            menu: {}
        });
        return;
    }

    const current = (await firestore.collection('gunn').doc('menu').get()).data()!;
    if (DateTime.fromISO(current.timestamp).plus({ day: 1 }) > now)
        return;

    const { daysInMonth, month, year } = now.plus({ week: 1 });
    const { alternates } = await getAlternates();
    const nutrislice = 'https://pausd.api.nutrislice.com/menu/api';
    const nutrition = new Map();

    async function getNutrition(day: number) {
        return await Promise.all(['breakfast', 'lunch'].map(async meal => {
            const { days } = await fetch(`${nutrislice}/weeks/school/henry-m-gunn-hs/menu-type/${meal}/${year}/${month}/${day}`)
                .then(res => res.json())
                .catch(() => []);
            if (!days) return;
            const items = days
                .flatMap((day: any) => day.menu_items)
                .map((items: any) => items.food)
                .filter(Boolean);
            for (const item of items) {
                nutrition.set(item.name, {
                    serving: Object
                        .values(item.serving_size_info)
                        .every(x => !x) ? null : item.serving_size_info,
                    nutrition: Object
                        .values(item.rounded_nutrition_info)
                        .every(x => !x) ? null : item.rounded_nutrition_info,
                    ingredients: item.ingredients || null
                });
            }
        }));
    }

    async function getMenu(date: DateTime) {
        const { year, month, day } = date;
        const [brunch, lunch] = await Promise.all(['breakfast', 'lunch'].map(async meal => {
            const { menu_items } = await fetch(`${nutrislice}/digest/school/henry-m-gunn-hs/menu-type/${meal}/date/${year}/${month}/${day}`)
                .then(res => res.json())
                .catch(() => []);
            if (!menu_items) return;
            return Object.fromEntries(menu_items.map((item: string) => [item, nutrition.get(item) ?? null]));
        }));
        return [date.toFormat('MM-dd'), {
            brunch: brunch ?? null,
            lunch: lunch ?? null
        }];
    }

    const days = Array
        .from({ length: daysInMonth }, (_, i) => DateTime
            .fromObject({ year, month, day: i + 1 })
            .setZone('America/Los_Angeles'))
        .filter(day => {
            const { periods } = getSchedule(day, alternates);
            return periods && periods.filter(({ n }) => n === 'B' || n === 'L').length;
        });

    await Promise.all(Array
        .from({ length: Math.ceil((days[days.length - 1].day - days[0].day) / 7 + 1) }, (_, i) => 7 * i + days[0].day)
        .map(getNutrition));

    const menu = Object.fromEntries(await Promise.all(days.map(getMenu)));

    await firestore.collection('gunn').doc('menu').set({
        timestamp: new Date().toISOString(),
        menu: { ...current.menu, ...menu }
    });
})