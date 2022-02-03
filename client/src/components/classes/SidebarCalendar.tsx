import React, { useContext, useState } from 'react';
import moment from 'moment';

// Types
import { ActiveItemState } from './Assignments';
import { AssignmentBlurb, parseLabelColor, parsePriority } from '../../util/sgyFunctions';

// Components
import Spinner from 'reactstrap/es/Spinner';
import { parsePeriodColor } from '../schedule/Periods';

// Contexts
import UserDataContext from '../../contexts/UserDataContext';
import { pluralize, shortify } from '../../util/sgyHelpers';

// type of a transition
type LineType = "same-day" | "diff-day" | "large-diff";

const SidebarTooltip = (props: { 
    circle: {
        item: AssignmentBlurb;
        radius: number;
        cy: number
    },
    left: number
}) => {
    const {circle,left} = props;
    const item = circle.item;

    return <div
        className="upcoming-cal-tooltip"
        style={{
            top: circle.cy,
            left,
        }}
    >
        {shortify(item.name, 20)}
    </div>
}

// Side calendar for large screens on Upcoming
// Doubles as a date range filter for the assignments, and for a quick visualization of due dates
export default function SidebarCalendar(props: ActiveItemState & {upcoming: AssignmentBlurb[]|null}) {
    const { upcoming: raw, activeItem, setActiveItem } = props;
    const userData = useContext(UserDataContext);

    if (!raw) return <div className="upcoming-cal" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Spinner />
    </div>

    const upcoming = raw.filter(a => !a.completed);

    const priorityToRadius = (p: number) => { // priority to radius of circle
        const b = 20;
        if(p === -1) return b;
        return (4-p)*5 + b;
    }
    const parseDistance = (from: AssignmentBlurb, to: AssignmentBlurb): [number, LineType] => { // the distance between two circles, and also the *type* of that transition

        const minDist = 15; // we don't want the distance to be 0
        // console.log(from.timestamp?.format('YYYY MMMM Do'))
        if (moment(from.timestamp!).isSame(to.timestamp!, 'day')) {
            // if they're the same day, determine the distance by hours
            const diffSecs = moment(to.timestamp!).diff(moment(from.timestamp!), 'seconds');
            const dist = diffSecs / 60 / 60 * 3; // hours * 3
            return [Math.max(dist, minDist), 'same-day'];
        }

        // check days
        const diffDays = moment(to.timestamp!).startOf('day').diff(moment(from.timestamp!).startOf('day'), 'days');

        if (diffDays > 5) {
            const diff = 200 + Math.sqrt(diffDays) * 10;
            return [diff, 'large-diff'];
        }

        const diff = 30 + diffDays * 30;
        return [diff, 'diff-day'];
    }

    const circles: {item: AssignmentBlurb, radius: number, cy: number}[] = [];
    // same-day has no cut; diff-day has a double cut; and for large cuts, we do a super cut
    const lines: {sy: number, ey: number, type: LineType}[] = []; 
    // days; stores the start and end (y-positions) of each day, in the format YYYY-MM-DD
    const days: Map<string, {sy: number, ey: number}> = new Map();

    // the height of the svg
    let svgheight = 50;
    for(let i = 0; i < upcoming.length; i++) {
        if(i === 0) {
            // first circle starts at a set y=50
            const radius = priorityToRadius(upcoming[i].priority);
            circles.push({
                item: upcoming[i],
                radius,
                cy: 50 + radius
            })
        } else {
            const {radius: pradius, cy: pcy, item: pitem} = circles[i-1];

            const radius = priorityToRadius(upcoming[i].priority);
            const dist = parseDistance(pitem, upcoming[i]);
            const cy = pcy + pradius + radius + dist[0];
            circles.push({
                item: upcoming[i],
                radius,
                cy
            });

            lines.push({
                sy: pcy + pradius,
                ey: cy - radius,
                type: dist[1]
            })
        }

        const sy = circles[i].cy - circles[i].radius;
        const ey = circles[i].cy + circles[i].radius;

        svgheight = ey + 50;
        const day = moment(upcoming[i].timestamp!).startOf('day').format('YYYY-MM-DD');
        if(days.has(day)) {
            days.set(day, {...days.get(day)!, ey});
        } else {
            days.set(day, {sy, ey});
        }
    }

    const weekdays = ['U', 'M', 'T', 'W', 'θ', 'F', 'S'];

    const width = 275;
    const timelineX = 65;
    const weekdayX = 140;
    const dayX = 180;
    const strokeWeight = 6;
    const tooltipItem = activeItem && circles.find(a => a.item.id === activeItem.id);

    // 
    return (
        <div className="upcoming-cal">
            <svg width={width} height={svgheight} >
                <defs>
                    {/* https://tympanus.net/codrops/2019/01/15/svg-filters-101/ < super helpful info on svg filters */}
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur1" />
                        <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur2" />

                        <feMerge result="blur">
                            <feMergeNode in="blur1" />
                            <feMergeNode in="blur2" />
                        </feMerge>

                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {lines.map(line => {
                    const avg = (line.sy + line.ey)/2;
                    const tick = 10;
                    const ticks = line.type === "same-day" ? [] : line.type === "diff-day" ? [-8,8] : [-16,0,16] ;
                    return <g key={line.sy}>
                        <line 
                            x1={timelineX} y1={line.sy}
                            x2={timelineX} y2={line.ey} 
                            stroke={'var(--contrast)'}
                            strokeWidth={strokeWeight} 
                        />

                        {ticks.map(t => 
                            <line 
                                key={line.sy + " " + t} 
                                x1={timelineX - tick} y1={avg + tick + t}
                                x2={timelineX + tick} y2={avg - tick + t}
                                stroke={'var(--contrast)'}
                                strokeWidth={strokeWeight} 
                            />)
                        }
                    </g>
                })}

                {circles.map(circle =>
                    <a href={`#assignment-${circle.item.id}`}>
                    <g
                        key={circle.item.id}
                        filter={activeItem && circle.item.id === activeItem.id ? 'url(#glow)' : ''}
                        cursor="pointer"

                        onMouseEnter={() => setActiveItem(circle.item)}
                        onMouseLeave={() => setActiveItem(null)}
                    >
                        <circle
                            cx={timelineX} cy={circle.cy}
                            r={circle.radius}
                            stroke={parsePeriodColor(circle.item.period, userData)}
                            strokeWidth={strokeWeight}
                            fill={'#ffffff00'}
                        />
                    </g>
                    </a>
                )}

                {[...days].map(([day, { sy, ey }]) => <g key={day}>
                    <text 
                        x={weekdayX} y={(sy + ey) / 2} 
                        dominantBaseline="central" // center vertically
                        style={{ 
                            fontSize: 50, 
                            fill: 'var(--primary)', 
                            fontFamily: 'var(--font-family-monospace)' 
                        }}
                    >
                        {weekdays[moment(day).day()]}
                    </text>

                    <text
                        x={dayX} y={(sy + ey) / 2 - 10}
                        dominantBaseline="central" // center vertically
                        style={{
                            fontSize: 15,
                            fill: 'var(--primary)'
                        }}
                    >
                        {moment(day).format('MM/DD')}
                    </text>
                    <text
                        x={dayX} y={(sy + ey) / 2 + 10}
                        dominantBaseline="central" // center vertically
                        style={{
                            fontSize: 15,
                            fill: 'var(--primary)'
                        }}
                    >
                        In {pluralize(moment(day).diff(moment(), 'days'), 'day')}
                    </text>
                </g>)} 
            </svg>
            
            {/* Tooltip */}
            {tooltipItem && <SidebarTooltip left={timelineX + tooltipItem.radius + 2 * strokeWeight} circle={tooltipItem}/>}
            
        </div>
    );
}
