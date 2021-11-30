import moment from "moment";
import { useScreenType } from "../../../hooks/useScreenType";
import { DateRangePicker } from "../../schedule/DateSelector";
import UpcomingPalette, { PaletteProps } from "./PaletteClassFilter";

export type DateRangeProps = {
    start: moment.Moment;
    setStart: (s: moment.Moment) => void;
    end: moment.Moment;
    setEnd: (e: moment.Moment) => void;
}

const UpcomingDateRangePicker = ({ start, end, setStart, setEnd }: DateRangeProps) => {
    return <DateRangePicker start={start} end={end} setStart={setStart} setEnd={setEnd} calStart={moment().startOf('day')} />
}

export const UpcomingSearchBar = (props: {
    setQuery: (q: string) => void,
    query: string,
    selected: string
} & PaletteProps & DateRangeProps) => {
    // lol props

    const screenType = useScreenType();
    return <div className="upcoming-search">
        <input type="text" placeholder="Search" defaultValue={props.query} className="upcoming-search-bar" onChange={(event) => props.setQuery(event.target.value)} />
        <div className={"upcoming-filters " + screenType}>
            {props.selected === 'A' ? <UpcomingPalette classes={props.classes} classFilter={props.classFilter} setClassFilter={props.setClassFilter} /> : null}
            {screenType !== 'smallScreen' && screenType !== 'phone' ? null : <UpcomingDateRangePicker start={props.start} setStart={props.setStart} end={props.end} setEnd={props.setEnd} />}
        </div>
    </div>
}

export default UpcomingSearchBar;