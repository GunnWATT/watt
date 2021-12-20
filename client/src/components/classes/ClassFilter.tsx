import {useContext, useState} from 'react';
import { useScreenType } from '../../hooks/useScreenType';
import {CheckCircle, Plus, XCircle} from 'react-feather';

// Components
import Picker from '../layout/Picker';
import {AssignmentTag} from './Assignments';

// Context
import UserDataContext from '../../contexts/UserDataContext';

// Utilities
import {allLabels, defaultLabels, parseLabelColor, parseLabelName} from './functions/SgyFunctions';


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
                className="class-filter-search-bar"
                onChange={(event) => setFilter({...filter, query: event.target.value})}
            />
            <div className="assignment-tags">
                {filter.classes.map((c, i) => c && (
                    <AssignmentTag label={classes[i].name} color={classes[i].color} />
                ))}
                {filter.labels.map(label => (
                    <AssignmentTag label={parseLabelName(label, userData)} color={parseLabelColor(label, userData)} />
                ))}

                <Picker className="tag-plus">
                    {(open, setOpen) => <>
                        <Plus onClick={() => setOpen(!open)} />
                        <ClassFilterPicker hidden={!open} {...props} />
                    </>}
                </Picker>
            </div>
        </div>
    );
}

function ClassFilterPicker(props: ClassFilterProps & { hidden: boolean }) {
    const { filter, setFilter, classes, hidden } = props;
    const screenType = useScreenType();
    const userData = useContext(UserDataContext);

    if (hidden) return null;

    const toggleClass = (index: number) => {
        const newFilter = {...filter};
        newFilter.classes[index] = !newFilter.classes[index];
        setFilter(newFilter);
    }

    const toggleLabel = (labelID: string) => {
        const newFilter = { ...filter };
        newFilter.labels = newFilter.labels.includes(labelID)
            ? newFilter.labels.filter(l => l !== labelID)
            : [...newFilter.labels, labelID];
        setFilter(newFilter);
    }

    const setAllClasses = (value: boolean) =>
        setFilter({...filter, classes: filter.classes.map(() => value)});
    const selectAllClasses = () => setAllClasses(true);
    const deselectAllClasses = () => setAllClasses(false);

    const selectAllLabels = () =>
        setFilter({...filter, labels: allLabels(userData)});
    const deselectAllLabels = () =>
        setFilter({...filter, labels: []});

    return (
        <div className={"class-picker " + screenType}>
            <input type="text" placeholder="Search" className="class-picker-search" />

            <div className="class-picker-tags">
                <section className="class-tags">
                    <span className="heading">
                        <h4>Classes</h4>
                        {filter.classes.every((c) => !c) ? (
                            <button onClick={selectAllClasses}>Select all</button>
                        ) : (
                            <button onClick={deselectAllClasses}>Deselect all</button>
                        )}
                    </span>
                    <hr />
                    {classes.map((c, index) => (
                        <div key={index} className="class-picker-class" onClick={() => toggleClass(index)}>
                            <div
                                // TODO: see comment below about dot component extraction
                                className="class-picker-dot"
                                style={{
                                    backgroundColor: filter.classes[index] ? c.color : 'var(--content-primary)',
                                    border: filter.classes[index] ? '' : '2px inset var(--secondary)'
                                }}
                            >
                                {c.period}
                            </div>

                            <div>{c.name}</div>
                        </div>
                    ))}
                </section>

                <section className="label-tags">
                    <span className="heading">
                        <h4>Labels</h4>
                        {!filter.labels.length ? (
                            <button onClick={selectAllLabels}>Select all</button>
                        ) : (
                            <button onClick={deselectAllLabels}>Deselect all</button>
                        )}
                    </span>
                    <hr />
                    {allLabels(userData).map((labelID, index) => (
                        <div key={labelID} className="class-picker-class" onClick={() => toggleLabel(labelID)}>
                            <div
                                // TODO: see comment below about dot component extraction
                                className="class-picker-dot"
                                style={{
                                    backgroundColor: filter.labels.includes(labelID) ? parseLabelColor(labelID, userData) : 'var(--content-primary)',
                                    border: filter.labels.includes(labelID) ? '' : '2px inset var(--secondary)'
                                }}
                            />

                            <div>{parseLabelName(labelID, userData)}</div>
                        </div>
                    ))}
                </section>
            </div>
        </div>
    );
}
