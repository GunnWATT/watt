import { useContext } from 'react';
import { useSchedule } from '../../hooks/useSchedule';
import moment, {Moment} from 'moment-timezone';
import { parsePeriodColor } from './Periods';

// Contexts
import UserDataContext from '../../contexts/UserDataContext';
import CurrentTimeContext from '../../contexts/CurrentTimeContext';


type ClockProps = { viewDate: Moment };
export default function Clock(props: ClockProps) {
    const { viewDate } = props;
    const time = useContext(CurrentTimeContext);
    const timeZone = moment.tz.guess(true);

    const radius = 40;
    const size = radius * 2 + 20;
    const s = time.seconds() + time.minutes() * 60 + time.hours() * 60 * 60;
    const secondDegs = s / 60 * 360;
    const minuteDegs = s / (60**2) * 360;
    const hourDegs = s / (60**2) / 12 * 360;

    // Period handling
    const {periods} = useSchedule(time);
    const userData = useContext(UserDataContext);


    return (
        <div className="flex justify-center">
            <svg width={size} height={size}>
                <circle cx={size / 2} cy={size / 2} r={radius} className="fill-sidebar dark:fill-sidebar-dark" />

                {/* Minute Hand */}
                <line
                    x1={size / 2} y1={size / 2}
                    x2={size / 2} y2={size / 2 - radius * 0.7}
                    className="stroke-primary dark:stroke-primary-dark stroke-2 origin-center transition-transform duration-100"
                    style={{
                        strokeLinecap: 'round',
                        transform: `rotate(${minuteDegs}deg)`,
                    }}
                />

                {/* Second Hand */}
                <line
                    x1={size / 2} y1={size / 2}
                    x2={size / 2} y2={size / 2 - radius * 0.8}
                    className="stroke-secondary dark:stroke-secondary-dark stroke-[1.5] origin-center transition-transform duration-100"
                    style={{
                        strokeLinecap: 'round',
                        transform: `rotate(${secondDegs}deg)`,
                    }}
                />

                {/* Hour Hand */}
                <line
                    x1={size / 2} y1={size / 2}
                    x2={size / 2} y2={size / 2 - radius * 0.5}
                    className="stroke-theme dark:stroke-theme-dark stroke-2 origin-center transition-transform duration-100"
                    style={{
                        strokeLinecap: 'round',
                        transform: `rotate(${hourDegs}deg)`,
                    }}
                />

                {/* Periods */}
                {periods && periods.map(({n, s, e}) => {
                    // TODO: this is not a very clean or efficient way of doing this
                    // Hopefully something else can be thought of soon!
                    const startObj = viewDate.clone().add(s, 'minutes').tz(timeZone);
                    const endObj = viewDate.clone().add(e, 'minutes').tz(timeZone);

                    const start = ((startObj.minutes() + startObj.hours() * 60) / 720 - 1/4) * 2 * Math.PI;
                    const end = ((endObj.minutes() + endObj.hours() * 60) / 720 - 1/4) * 2 * Math.PI;

                    // Ignore non number periods (brunch, lunch)
                    // TODO: consider whether SELF and PRIME should be displayed?
                    if (isNaN(parseInt(n))) return null;
                    return (
                        <path
                            key={n}
                            d={`M ${size / 2 + radius * Math.cos(end)} ${size / 2 + radius * Math.sin(end)} \nA ${radius} ${radius} 0 0 0 ${size / 2 + radius * Math.cos(start)} ${size / 2 + radius * Math.sin(start)}`}
                            stroke={parsePeriodColor(n, userData)}
                            strokeWidth={6}
                            fill={'transparent'}
                        />
                    )
                })}
            </svg>
        </div>
    )
}
