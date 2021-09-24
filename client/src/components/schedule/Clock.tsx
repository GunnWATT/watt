import { useContext, useState } from 'react';
import moment from 'moment-timezone';

import { SCHOOL_START, SCHOOL_END_EXCLUSIVE, PeriodObj, sortPeriodsByStart, numToWeekday, parsePeriodColor } from './Periods';

// Data
import schedule from '../../data/schedule';
import alternates from '../../data/alternates';

import UserDataContext from '../../contexts/UserDataContext';


export default function Clock(props: {time: moment.Moment}) {
    const { time } = props;
    // const time = props.time.add('days', 2);
    // const time = moment('2021-08-30 10:34:15')
    // console.log(time.format('YYYY-DD-MM hh:mm:ss'));
    
    const radius = 40;
    const size = radius * 2 + 20;
    const s = time.seconds() + time.minutes()*60 + time.hours()*60*60;
    const secondDegs = s/60 * 360;
    const minuteDegs = s/(60**2) * 360;
    const hourDegs = s/(60**2)/12 * 360;

    
    let periods: [string, PeriodObj][] | null = [];

    // If the current date falls on summer break, return early
    if (time.isBefore(SCHOOL_START) || time.isAfter(SCHOOL_END_EXCLUSIVE)) {
        periods = (null);
    } else {
        // Check for alternate schedules
        let altFormat = time.format('MM-DD');
        if (alternates.alternates.hasOwnProperty(altFormat)) {
            // If viewDate exists in alt schedules, load that schedule
            let p = alternates.alternates[altFormat];
            periods = (p ? sortPeriodsByStart(p) : null);
        } else {
            // Otherwise, use default schedule
            let p = schedule[numToWeekday(Number(time.format('d')))];
            periods = (p ? sortPeriodsByStart(p) : null);
        }
    }

    const userData = useContext(UserDataContext);

    if(periods) {

        periods = periods.filter(([name, value]) => {
            if (name === "0" && !userData?.options.period0) return false;
            if (name === "8" && !userData?.options.period8) return false;
            return true;
        })
        // console.log(s / 60, periods[0][1].s + 720, periods[periods.length - 1][1].s - 720);

        if (periods && (s / 60 >= periods[0][1].s + 660 || s / 60 <= periods[periods.length - 1][1].s - 660)) periods = null;
    }

    return <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    }}>
        <svg width={size} height={size}>
            <circle cx={size / 2} cy={size / 2} r={radius} fill="var(--bg-primary)" />

            {/* Minute Hand */}
            <line x1={size / 2} y1={size / 2} x2={size / 2} y2={size / 2 - radius * 0.7} style={{
                stroke: 'var(--primary)',
                strokeWidth: 2,
                strokeLinecap: 'round',
                transform: `rotate(${minuteDegs}deg)`,
                transformOrigin: `center`,
                transition: 'transform 0.1s'
            }} />

            {/* Second Hand */}
            <line x1={size / 2} y1={size / 2} x2={size / 2} y2={size / 2 - radius * 0.8} style={{
                stroke: 'var(--secondary)',
                strokeWidth: 1.5,
                strokeLinecap: 'round',
                transform: `rotate(${secondDegs}deg)`,
                transformOrigin: `center`,
                transition: 'transform 0.1s'
            }} />

            {/* Hour Hand */}
            <line x1={size / 2} y1={size / 2} x2={size / 2} y2={size / 2 - radius * 0.5} style={{
                stroke: 'var(--active)',
                strokeWidth: 2,
                strokeLinecap: 'round',
                transform: `rotate(${hourDegs}deg)`,
                transformOrigin: `center`,
                transition: 'transform 0.1s'
            }} />

            {/* Periods */}
            {periods ? 
                periods.map(([name, val]) => {
                    // I hate top left origin
                    const start = (val.s/720 - 1/4) * 2 * Math.PI;
                    const end = (val.e / 720 - 1/4) * 2 * Math.PI;
                    if(isNaN(parseInt(name))) return null;
                    return <path 
                        d={`M ${size / 2 + radius * Math.cos(end)} ${size / 2 + radius * Math.sin(end)} \nA ${radius} ${radius} 0 0 0 ${size / 2 + radius * Math.cos(start)} ${size / 2 + radius * Math.sin(start)}`}
                        stroke={parsePeriodColor(name, userData)}
                        strokeWidth={6}
                        fill={'transparent'}
                    />
                })
            : null}

        </svg>
    </div>
}
