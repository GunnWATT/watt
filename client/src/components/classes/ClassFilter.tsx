import {useContext, useState, ReactNode, MouseEventHandler} from 'react';
import {Popover, Transition} from '@headlessui/react';
import {FiPlus} from 'react-icons/all';

// Components
import AnimatedPopover from '../layout/AnimatedPopover';
import {Tags, AssignmentTag} from './AssignmentTags';
import Dot from '../layout/Dot';

// Contexts
import UserDataContext from '../../contexts/UserDataContext';

// Utilities
import {allLabels, parseLabelColor, parseLabelName} from '../../util/sgyLabels';
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
        <div className="flex flex-col gap-1.5 mb-3">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search"
                    defaultValue={filter.query}
                    className="w-full bg-sidebar dark:bg-sidebar-dark border-2 border-tertiary dark:border-tertiary-dark rounded-full py-1.5 px-3"
                    onChange={(event) => setFilter({...filter, query: event.target.value})}
                />
                <Popover>
                    <PopoverPlus className="absolute inset-y-0 right-4 my-auto" />
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

            <Tags>
                {filter.classes.map((c, i) => c && (
                    <AssignmentTag label={classes[i].name} color={classes[i].color} />
                ))}
                {filter.labels.map(label => (
                    <AssignmentTag label={parseLabelName(label, userData)} color={parseLabelColor(label, userData)} />
                ))}
            </Tags>
        </div>
    );
}

export function PopoverPlus(props: {className?: string}) {
    return (
        <Popover.Button className={props.className}>
            <FiPlus className="w-6 h-6 rounded-full bg-background dark:bg-background-dark p-1" />
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
        <AnimatedPopover className={"absolute top-[calc(100%_+_15px)] right-0 p-2.5 w-[300px] bg-content dark:bg-content-dark rounded-md z-10 shadow-lg " + screenType}>
            <input
                type="text"
                placeholder="Search"
                className="bg-content-secondary dark:bg-content-secondary-dark rounded w-full px-2.5 py-1.5"
                onChange={(e) => setSearch(e.target.value)}
            />

            <div className="flex flex-col gap-4 h-64 mt-2 p-1.5 border-y border-tertiary dark:border-tertiary-dark overflow-y-auto">
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
                    <TagPickerOption
                        key={labelID}
                        name={parseLabelName(labelID, userData)}
                        // TODO: think of how to keep this as style arguments but remove the dependency on var()
                        // as var() will be eliminated with the CSS removal
                        backgroundColor={labels.includes(labelID) ? parseLabelColor(labelID, userData) : 'var(--content-primary)'}
                        border={labels.includes(labelID) ? '' : '2px inset var(--secondary)'}
                        onClick={() => toggleLabel(labelID)}
                    />
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
                    <TagPickerOption
                        key={index}
                        name={c.name}
                        label={c.period}
                        backgroundColor={selected[index] ? c.color : 'var(--content-primary)'}
                        border={selected[index] ? '' : '2px inset var(--secondary)'}
                        onClick={() => toggleClass(index)}
                    />
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
        <section className="flex flex-col gap-1">
            <span className="flex gap-2 items-center border-b-2 border-tertiary dark:border-tertiary-dark mb-1">
                <h4 className="text-lg font-medium">{heading}</h4>
                {noneSelected ? (
                    <TagPickerSelectButton onClick={selectAll}>
                        Select all
                    </TagPickerSelectButton>
                ) : (
                    <TagPickerSelectButton onClick={deselectAll}>
                        Deselect all
                    </TagPickerSelectButton>
                )}
            </span>
            {children}
        </section>
    )
}

function TagPickerSelectButton(props: {onClick?: MouseEventHandler<HTMLButtonElement>, children: ReactNode}) {
    return (
        <button className="rounded text-[0.7rem] px-1 py-0.5 bg-content-secondary dark:bg-content-secondary-dark" onClick={props.onClick}>
            {props.children}
        </button>
    )
}

type TagPickerOptionProps = {
    name: string, label?: string,
    backgroundColor: string, border: string,
    onClick: MouseEventHandler<HTMLDivElement>
};
function TagPickerOption(props: TagPickerOptionProps) {
    const {backgroundColor, border, name, label, onClick} = props;

    return (
        <div className="flex items-center gap-3 cursor-pointer" onClick={onClick}>
            <Dot
                size={28}
                color={backgroundColor}
                border={border}
            >
                {label}
            </Dot>

            <div className="overflow-ellipsis overflow-hidden whitespace-nowrap">
                {name}
            </div>
        </div>
    )
}
