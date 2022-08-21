import {ReactNode, useContext, useState} from 'react';
import {DateTime} from 'luxon';

// Components
import {Spinner} from '../layout/Loading';

// Contexts
import UserDataContext from '../../contexts/UserDataContext';
import CurrentTimeContext from '../../contexts/CurrentTimeContext';

// Utilities
import { ActiveItemState } from './Assignments';
import { AssignmentBlurb } from '../../util/sgyAssignments';
import { parsePeriodColor } from '../schedule/Periods';
import { pluralize } from '../../util/sgyHelpers';
import {DATE_SHORT_NO_YEAR} from '../../util/dateFormats';


// type of a transition
type LineType = "same-day" | "diff-day" | "large-diff";

type TimelineTooltipProps = {
    circle: { item: AssignmentBlurb, radius: number, cy: number },
    left: number
};
function TimelineTooltip(props: TimelineTooltipProps) {
    const {circle, left} = props;
    const item = circle.item;

    return (
        <div
            className="absolute -translate-y-1/2 px-2 py-0.5 max-w-[12.5rem] overflow-hidden overflow-ellipsis whitespace-nowrap bg-content rounded-sm"
            style={{
                top: circle.cy,
                left,
            }}
        >
            {item.name}
        </div>
    )
}

// Side calendar for large screens on Upcoming
// Doubles as a date range filter for the assignments, and for a quick visualization of due dates
export default function UpcomingTimeline(props: ActiveItemState & {upcoming: AssignmentBlurb[]|null}) {
    const { upcoming: raw, activeItem, setActiveItem } = props;

    const userData = useContext(UserDataContext);
    const currTime = useContext(CurrentTimeContext);

    if (!raw) return (
        <TimelineWrapper className="flex items-center justify-center">
            <Spinner />
        </TimelineWrapper>
    )

    const upcoming = raw.filter(a => !a.completed);

    // Priority to radius of circle
    const priorityToRadius = (p: number) => {
        const b = 20;
        if (p === -1) return b;
        return (4 - p) * 5 + b;
    }

    // The distance between two circles, and also the *type* of that transition
    const parseDistance = (from: AssignmentBlurb, to: AssignmentBlurb): [number, LineType] => {
        const minDist = 15; // we don't want the distance to be 0
        // console.log(from.timestamp?.format('YYYY MMMM Do'))
        if (from.timestamp!.hasSame(to.timestamp!, 'day')) {
            // if they're the same day, determine the distance by hours
            const diffSecs = to.timestamp!.diff(from.timestamp!, 'seconds').seconds;
            const dist = diffSecs / 60 / 60 * 3; // hours * 3
            return [Math.max(dist, minDist), 'same-day'];
        }

        // check days
        const diffDays = to.timestamp!.startOf('day').diff(from.timestamp!.startOf('day'), 'days').days;

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
    for (let i = 0; i < upcoming.length; i++) {
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
            });
        }

        const sy = circles[i].cy - circles[i].radius;
        const ey = circles[i].cy + circles[i].radius;

        svgheight = ey + 50;
        const day = upcoming[i].timestamp!.startOf('day').toISO();
        days.set(day, days.has(day) ? {...days.get(day)!, ey} : {sy, ey});
    }

    const weekdays = ['U', 'M', 'T', 'W', 'θ', 'F', 'S'];

    const width = 275;
    const timelineX = 65;
    const weekdayX = 140;
    const dayX = 180;
    const strokeWeight = 6;
    const tooltipItem = activeItem && circles.find(a => a.item.id === activeItem.id);


    return (
        // TODO: the `position: sticky` on this was broken a while ago and now is explicitly removed;
        // the height of the timeline when scrolling up didn't take up the full screen and thus looked odd.
        // Should we try to keep the sticky scrolling and attempt to remedy the height problem or keep it
        // at 100% height?
        <TimelineWrapper>
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
                    const avg = (line.sy + line.ey) / 2;
                    const tick = 10;
                    const ticks = line.type === 'same-day' ? [] : line.type === 'diff-day' ? [-8, 8] : [-16, 0, 16];
                    return (
                        <g key={line.sy}>
                            <line
                                x1={timelineX} y1={line.sy}
                                x2={timelineX} y2={line.ey}
                                className="stroke-background dark:stroke-content"
                                strokeWidth={strokeWeight}
                            />

                            {ticks.map(t => (
                                <line
                                    key={line.sy + " " + t}
                                    x1={timelineX - tick} y1={avg + tick + t}
                                    x2={timelineX + tick} y2={avg - tick + t}
                                    className="stroke-background dark:stroke-content"
                                    strokeWidth={strokeWeight}
                                />
                            ))}
                        </g>
                    )
                })}

                {circles.map(circle => (
                    <a href={`#assignment-${circle.item.id}`}>
                        <g
                            key={circle.item.id}
                            filter={activeItem && circle.item.id === activeItem.id ? 'url(#glow)' : ''}
                            className="cursor-pointer"
                            onMouseEnter={() => setActiveItem(circle.item)}
                            onMouseLeave={() => setActiveItem(null)}
                        >
                            <circle
                                cx={timelineX} cy={circle.cy}
                                r={circle.radius}
                                stroke={parsePeriodColor(circle.item.period, userData)}
                                strokeWidth={strokeWeight}
                                fill="#ffffff00"
                            />
                        </g>
                    </a>
                ))}

                {[...days].map(([day, { sy, ey }]) => {
                    const dateTime = DateTime.fromISO(day);
                    return (
                        <g key={day}>
                            <text
                                x={weekdayX} y={(sy + ey) / 2}
                                dominantBaseline="central" // center vertically
                                className="font-mono fill-primary"
                                style={{fontSize: 50}}
                            >
                                {weekdays[dateTime.weekday % 7]}
                            </text>

                            <text
                                x={dayX} y={(sy + ey) / 2 - 10}
                                dominantBaseline="central" // center vertically
                                className="fill-primary"
                                style={{fontSize: 15}}
                            >
                                {dateTime.toLocaleString(DATE_SHORT_NO_YEAR)}
                            </text>
                            <text
                                x={dayX} y={(sy + ey) / 2 + 10}
                                dominantBaseline="central" // center vertically
                                className="fill-primary"
                                style={{fontSize: 15}}
                            >
                                In {pluralize(Math.ceil(dateTime.diff(currTime, 'days').days), 'day')}
                            </text>
                        </g>
                    )
                })}
            </svg>

            {/* Tooltip */}
            {tooltipItem && (
                <TimelineTooltip
                    left={timelineX + tooltipItem.radius + 2 * strokeWeight}
                    circle={tooltipItem}
                />
            )}
        </TimelineWrapper>
    );
}

function TimelineWrapper(props: {children: ReactNode, className?: string}) {
    return (
        <div className={'relative bg-sidebar dark:bg-sidebar-dark rounded w-72 flex-none' + (props.className ? ` ${props.className}` : '')}>
            {props.children}
        </div>
    )
}
