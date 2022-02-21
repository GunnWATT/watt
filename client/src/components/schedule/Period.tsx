import {Progress} from 'reactstrap';
import {Moment} from 'moment';
import 'twix';
import {bgColor, barColor, hexToRgb} from '../../util/progressBarColor';
import {Link} from 'react-feather';


type PeriodProps = {
    now: Moment, start: Moment, end: Moment,
    name: string, color: string, format: string, zoom?: string
};
const Period = (props: PeriodProps) => {
    const {now, start, end, name, color, format, zoom} = props;
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
            <h2 className="text-xl mb-2">{name}</h2>
            <h3 className="secondary">{t.simpleFormat(format)}</h3>
            <p className="secondary">{parseStartEnd()} — {t.countInner('minutes')} minutes long</p>
            {t.isCurrent() && (
                <Progress
                    value={(now.valueOf() - start.valueOf()) / (end.valueOf() - start.valueOf()) * 100}
                    style={{backgroundColor: bgColor(color)}}
                    barStyle={{backgroundColor: barColor(color)}}
                />
            )}
        </div>
    );
}

export default Period;
