import {Moment} from 'moment';
import 'twix';
import {bgColor, barColor, hexToRgb} from '../../util/progressBarColor';
import {Link} from 'react-feather';
import { ChevronUp, ChevronDown } from 'react-feather';
import { Disclosure } from '@headlessui/react';

type PeriodProps = {
    now: Moment, start: Moment, end: Moment,
    name: string, color: string, format: string, zoom?: string, note?: string
};
export default function Period(props: PeriodProps) {
    const {now, start, end, name, color, format, zoom, note} = props;
    const t = start.twix(end); // Twix duration representing the period

    // Determines what text to display regarding how long before/after the period was
    const parseStartEnd = () => {
        if (t.isPast()) return <span>Ended {end.fromNow()}</span>
        if (t.isCurrent()) return <span>Ending {end.fromNow()}, started {start.fromNow()}</span>
        if (t.isFuture()) return <span>Starting {start.fromNow()}</span>
    }

    return (
        <div className="border-none rounded-md shadow-lg mb-4 p-5 relative" style={{backgroundColor: color}}>
            {zoom && <a className="absolute secondary top-6 right-6" href={zoom} rel="noopener noreferrer" target="_blank"><Link/></a>}
            {note ? (
                <Disclosure>
                    {({open}) => (<>
                        <Disclosure.Button className="flex gap-2 items-center mb-2">
                            <h2 className="text-xl">{name}</h2>
                            {open ? (
                                <ChevronUp className="h-6 w-6 rounded-full p-1 bg-black/10 dark:bg-black/20" />
                            ) : (
                                <ChevronDown className="h-6 w-6 rounded-full p-1 bg-black/10 dark:bg-black/20" />
                            )}
                        </Disclosure.Button>
                        <Disclosure.Panel className="secondary bg-black/10 dark:bg-black/20 rounded text-md p-2 -mx-2 mb-2 whitespace-pre-wrap">
                            {note}
                        </Disclosure.Panel>
                    </>)}
                </Disclosure>
            ) : <h2 className="text-xl mb-2">{name}</h2>}
            <h3 className="secondary">{t.simpleFormat(format)}</h3>
            <p className="secondary">{parseStartEnd()} — {t.countInner('minutes')} minutes long</p>
            {t.isCurrent() && (
                // TODO: should this be abstracted with PeriodIndicator? They share some logic but differ in other ways
                <div className="mt-2 flex overflow-hidden h-3 rounded" style={{backgroundColor: bgColor(color)}}>
                    <div
                        className="transition-all duration-700"
                        style={{backgroundColor: barColor(color), width: `${(now.valueOf() - start.valueOf()) / (end.valueOf() - start.valueOf()) * 100}%`}}
                    />
                </div>
            )}
        </div>
    );
}
