import {useContext} from 'react';
import { useScreenType } from '../../hooks/useScreenType';
import {Plus} from 'react-feather';

// Components
import Picker from '../layout/Picker';
import {AssignmentTag} from './Assignments';

// Context
import UserDataContext from '../../contexts/UserDataContext';

// Utilities
import {defaultLabels, parseLabelColor} from './functions/SgyFunctions';


// A search / tag filtering component for Materials and Upcoming.
// Returns the user's current filter as a `QueryObj` containing their search, selected classes, and selected labels.

export type QueryObj = {
    query: string,
    labels: string[],
    classes: boolean[] // TODO: a boolean[] is maybe not the most eloquent way of expressing this
}

export type ClassFilterProps = {
    filter: QueryObj,
    setFilter: (query: QueryObj) => void,
    classes: { name: string, color: string, period: string }[];
};
export default function ClassFilter(props: ClassFilterProps) {
    const { filter, setFilter, classes } = props;
    const userData = useContext(UserDataContext);

    return (
        <div className="class-filter">
            <input
                type="text"
                placeholder="Search"
                defaultValue={filter.query}
                className="upcoming-search-bar"
                onChange={(event) => setFilter({...filter, query: event.target.value})}
            />
            <div className="assignment-tags">
                {filter.classes.map((c, i) => c && (
                    <AssignmentTag label={classes[i].name} color={classes[i].color} />
                ))}
                {filter.labels.map(label => (
                    <AssignmentTag label={label} color={parseLabelColor(label, userData)} />
                ))}

                <Picker className="tag-plus">
                    {(open, setOpen) => <>
                        <Plus className="tag-plus" onClick={() => setOpen(!open)} />
                        <ClassFilterPicker hidden={!open} {...props} />
                    </>}
                </Picker>
            </div>
        </div>
    );
}

// TODO: can we merge this with UpcomingPalette to maintain similarity with PriorityPicker?
// We wouldn't have to spread props downwards if we do; is the merged component too complex?
function ClassFilterPicker(props: ClassFilterProps & { hidden: boolean }) {
    const { filter, setFilter, classes, hidden } = props;
    const screenType = useScreenType();

    if (hidden) return null;

    const toggleFilter = (index: number) => {
        const newFilter = {...filter};
        newFilter.classes[index] = !newFilter.classes[index];
        setFilter(newFilter);
    }

    return (
        <div className={"upcoming-palette-picker " + screenType}>
            {classes.map((c, index) =>
                <div key={index} className="upcoming-palette-picker-class" onClick={() => toggleFilter(index)}>
                    <div
                        // TODO: see comment below about dot component extraction
                        className="upcoming-palette-picker-dot"
                        style={{
                            backgroundColor: filter.classes[index] ? c.color : 'var(--content-primary)',
                            border: filter.classes[index] ? '' : '2px inset var(--secondary)'
                        }}
                    >
                        {c.period}
                    </div>

                    <div>{c.name}</div>
                </div>
            )}

            <div className="upcoming-palette-footer">

            </div>
        </div>
    );
}
