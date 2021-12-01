import moment from 'moment';
import { useScreenType } from '../../../hooks/useScreenType';
import {DateRangePicker, DateRangeProps} from '../../schedule/DateSelector';
import UpcomingPalette, { PaletteProps } from './PaletteClassFilter';



const UpcomingDateRangePicker = (props: DateRangeProps) => {
    return <DateRangePicker {...props} calStart={moment().startOf('day')} />
}

export const UpcomingSearchBar = (props: {
    setQuery: (q: string) => void,
    query: string,
    selected: string
} & PaletteProps & DateRangeProps) => {
    // lol props

    const screenType = useScreenType();
    return (
        <div className="upcoming-search">
            <input
                type="text"
                placeholder="Search"
                defaultValue={props.query}
                className="upcoming-search-bar"
                onChange={(event) => props.setQuery(event.target.value)}
            />
            <div className={"upcoming-filters " + screenType}>
                {props.selected === 'A' && <UpcomingPalette classes={props.classes} classFilter={props.classFilter} setClassFilter={props.setClassFilter} />}
                {screenType !== 'smallScreen' && screenType !== 'phone' ? null : <UpcomingDateRangePicker start={props.start} setStart={props.setStart} end={props.end} setEnd={props.setEnd} />}
            </div>
        </div>
    )
}

export default UpcomingSearchBar;