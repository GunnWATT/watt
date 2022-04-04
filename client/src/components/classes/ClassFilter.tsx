import {useContext, useState, ReactNode} from 'react';
import {Popover, Transition} from '@headlessui/react';
import {Plus} from 'react-feather';

// Components
import AnimatedPopover from '../layout/AnimatedPopover';
import {AssignmentTag} from './Assignments';

// Contexts
import UserDataContext from '../../contexts/UserDataContext';

// Utilities
import {allLabels, parseLabelColor, parseLabelName} from '../../util/sgyFunctions';
import {useScreenType} from '../../hooks/useScreenType';


export type TagObj = {
    labels: string[],
    classes: boolean[] // TODO: a boolean[] is maybe not the most eloquent way of expressing this
}
export type QueryObj = TagObj & { query: string }


// A search / tag filtering component for Materials and Upcoming which wraps a search bar around a TagPicker,
// returning the user's current filter as a `QueryObj` containing their search and selected tags.
export type ClassFilterProps = {
    filter: QueryObj, setFilter: (query: QueryObj) => void,
    classes: { name: string, color: string, period: string }[];
};
export default function ClassFilter(props: ClassFilterProps) {
    const { filter, setFilter, classes } = props;
    const userData = useContext(UserDataContext);

    const setClasses = (classes: boolean[]) => setFilter({...filter, classes});
    const setLabels = (labels: string[]) => setFilter({...filter, labels});

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

                <Popover className="relative cursor-pointer ml-auto">
                    <PopoverPlus />
                    <TagPicker>
                        {(search) => (<>
                            <TagPickerClasses
                                selected={filter.classes}
                                setSelected={setClasses}
                                search={search}
                                classes={classes}
                            />
                            <TagPickerLabels
                                labels={filter.labels}
                                setLabels={setLabels}
                                search={search}
                            />
                        </>)}
                    </TagPicker>
                </Popover>
            </div>
        </div>
    );
}

export function PopoverPlus() {
    return (
        <Popover.Button>
            <Plus className="rounded-full bg-background dark:bg-background-dark p-1" />
        </Popover.Button>
    )
}

// The TagPicker popover panel which exposes a render prop to filter children by the current search
type TagPickerProps = {
    children: (search: string) => ReactNode
}
export function TagPicker(props: TagPickerProps) {
    const { children } = props;
    const screenType = useScreenType();

    const [search, setSearch] = useState('');

    return (
        <AnimatedPopover className={"class-picker " + screenType}>
            <input
                type="text"
                placeholder="Search"
                className="class-picker-search"
                onChange={(e) => setSearch(e.target.value)}
            />

            <div className="class-picker-tags">
                {children(search)}
            </div>
        </AnimatedPopover>
    );
}

// The label picker section, which selects labels like "Assignment" or "Note".
type TagPickerLabelsProps = {
    labels: string[], setLabels: (filter: string[]) => void,
    search: string
}
export function TagPickerLabels(props: TagPickerLabelsProps) {
    const {labels, setLabels, search} = props;
    const userData = useContext(UserDataContext);

    const toggleLabel = (labelID: string) => {
        let newFilter = [...labels];
        newFilter = newFilter.includes(labelID)
            ? newFilter.filter(l => l !== labelID)
            : [...newFilter, labelID];
        setLabels(newFilter);
    }

    const selectAllLabels = () => setLabels(allLabels(userData));
    const deselectAllLabels = () => setLabels([]);

    return (
        <TagPickerSection
            heading="Labels"
            selectAll={selectAllLabels}
            deselectAll={deselectAllLabels}
            noneSelected={!labels.length}
        >
            {allLabels(userData).map((labelID, index) => {
                if (!labelID.toLowerCase().includes(search.toLowerCase())) return null;
                return (
                    <div key={labelID} className="class-picker-class" onClick={() => toggleLabel(labelID)}>
                        <div
                            // TODO: see comment below about dot component extraction
                            className="class-picker-dot"
                            style={{
                                backgroundColor: labels.includes(labelID) ? parseLabelColor(labelID, userData) : 'var(--content-primary)',
                                border: labels.includes(labelID) ? '' : '2px inset var(--secondary)'
                            }}
                        />

                        <div>{parseLabelName(labelID, userData)}</div>
                    </div>
                );
            })}
        </TagPickerSection>
    )
}

// The class picker section, which selects classes like "Analysis H Tantod" and "AP US History Johnson".
type TagPickerClassesProps = {
    classes: { name: string, color: string, period: string }[],
    selected: boolean[], setSelected: (filter: boolean[]) => void,
    search: string
};
export function TagPickerClasses(props: TagPickerClassesProps) {
    const {classes, selected, setSelected, search} = props;

    const setAllClasses = (value: boolean) => setSelected(selected.map(() => value));
    const selectAllClasses = () => setAllClasses(true);
    const deselectAllClasses = () => setAllClasses(false);

    const toggleClass = (index: number) => {
        const newFilter = [...selected];
        newFilter[index] = !newFilter[index];
        setSelected(newFilter);
    }

    return (
        <TagPickerSection
            heading="Classes"
            selectAll={selectAllClasses}
            deselectAll={deselectAllClasses}
            noneSelected={selected.every((c) => !c)}
        >
            {classes.map((c, index) => {
                if (!c.name.toLowerCase().includes(search.toLowerCase())) return null;
                return (
                    <div key={index} className="class-picker-class" onClick={() => toggleClass(index)}>
                        <div
                            // TODO: see comment below about dot component extraction
                            className="class-picker-dot"
                            style={{
                                backgroundColor: selected[index] ? c.color : 'var(--content-primary)',
                                border: selected[index] ? '' : '2px inset var(--secondary)'
                            }}
                        >
                            {c.period}
                        </div>

                        <div>{c.name}</div>
                    </div>
                )
            })}
        </TagPickerSection>
    )
}

type TagPickerSectionProps = {
    heading: string, noneSelected: boolean,
    selectAll: () => void, deselectAll: () => void,
    children: ReactNode
}
function TagPickerSection(props: TagPickerSectionProps) {
    const {noneSelected, selectAll, deselectAll, heading, children} = props;

    return (
        <section className="label-tags">
            <span className="heading">
                <h4>{heading}</h4>
                {noneSelected ? (
                    <button onClick={selectAll}>Select all</button>
                ) : (
                    <button onClick={deselectAll}>Deselect all</button>
                )}
            </span>
            <hr />
            {children}
        </section>
    )
}
