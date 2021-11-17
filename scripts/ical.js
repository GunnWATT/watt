/**
 * I think this is just a helper file for altScheduleGenerator.js
 * I also think most of the code was written by Sean/Yu-Ting 
 * 
 * - Rog
 */

import ical from './node_modules/ical.js/build/ical'
import fetch from "node-fetch";

function flattenEvent(e) {
    let event = {};
    for(let i=0;i<e[1].length;i++) {
        let prop = e[1][i];
        event[prop[0]] = prop[3];
        //console.log('e',prop);
    }
    return event;
}

export default (url) => {

    return new Promise((resolve, reject) => {
        fetch(url).then(async (txt) => {
            const resp = await txt.text()
            try {
                let parsed = ical.parse(resp);
                let events = parsed[2];

                let result = [];
                events.forEach(e => result.push(flattenEvent(e)));
                resolve({events:result});
            } catch(e) {
                console.log(e);
                reject(e.message);
            }
        })
            .catch((e) => {
                reject(e);
            });
    });
}
