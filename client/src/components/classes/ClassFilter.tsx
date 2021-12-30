import LabelRow, {LabelObj} from './LabelRow';


// A search / tag filtering component for Materials and Upcoming which wraps a search bar around LabelRow.
// Returns the user's current filter as a `QueryObj` containing their search and selected labels.

export type QueryObj = LabelObj & {
    query: string
}

export type ClassFilterProps = {
    filter: QueryObj,
    setFilter: (query: QueryObj) => void,
    classes: { name: string, color: string, period: string }[];
};
export default function ClassFilter(props: ClassFilterProps) {
    const { filter, setFilter, classes } = props;

    const setLabels = (labels: LabelObj) => setFilter({...filter, ...labels});

    return (
        <div className="class-filter">
            <input
                type="text"
                placeholder="Search"
                defaultValue={filter.query}
                className="class-filter-search-bar"
                onChange={(event) => setFilter({...filter, query: event.target.value})}
            />
            <LabelRow filter={filter} setFilter={setLabels} classes={classes} />
        </div>
    );
}
