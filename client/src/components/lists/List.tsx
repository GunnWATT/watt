import {useState, useEffect} from 'react';
import NoResults from './NoResults';


type ListEntriesPair<T> = [string, T]
type ListProps<T> = {
    // Data can either be an Object.entries result or the raw JSON object
    // Perhaps this is an unideal implementation
    data: ListEntriesPair<T>[] | {[key: string]: T},
    filter: ([id, value]: ListEntriesPair<T>) => boolean,
    map: ([id, value]: ListEntriesPair<T>) => JSX.Element,
    sort: ([idA, valueA]: ListEntriesPair<T>, [idB, valueB]: ListEntriesPair<T>) => number,
    pinned: string[]
}

// Defines a higher order list component of type T where T is the type of the JSON representation of a list value
// (ex: Club, Staff, `{ new: true, name: "United Computations", ... }`).
// List accepts the raw data as either the entire JSON file (`{[key: string]: T}`) or already subjected to Object.entries
// (`[string, T][]` to be compatible with Club tab data filtering).
// A compatible `map` callback is used to map T to JSX elements and render the component, while `filter` filters the
// sorted T array based on user queries.
// Pinned items (given as a string[] of IDs) are displayed in a separate category above other results.
export default function List<T>(props: ListProps<T>) {
    // Filter and map are different for each list, so pass them in as props
    const {data, filter, map, sort, pinned} = props;

    const [content, setContent] = useState<JSX.Element[]>([]);
    const [pinnedContent, setPinnedContent] = useState<JSX.Element[]>([])

    // Renders content on mount and when data or query changes
    useEffect(() => {
        // Parses data into mappable form
        const parsed = Array.isArray(data)
            ? data.sort(sort) // If data has been subject to Object.entries already, sort it
            : Object.entries(data).sort(sort); // Otherwise, sort the result of Object.entries on the JSON

        // Filter out pinned components and display separately
        // Can probably be done better
        const pinnedData = parsed.filter(([id, value]) => pinned.includes(id));
        const unpinnedData = parsed.filter(([id, value]) => !pinned.includes(id));

        // Filter each via query, map to components
        setContent(unpinnedData.filter(filter).map(map));
        setPinnedContent(pinnedData.filter(filter).map(map))
    }, [data, filter])


    return content.length || pinnedContent.length ? (<>
        {pinnedContent.length > 0 && (
            <ul className="material-list">
                {pinnedContent}
            </ul>
        )}
        {content.length > 0 && pinnedContent.length > 0 && <hr/>}
        {content.length > 0 && (
            <ul className="material-list">
                {content}
            </ul>
        )}
    </>) : (
        <NoResults/>
    );
}
