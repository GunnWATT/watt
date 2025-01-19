import {useState, useEffect, ReactNode, startTransition} from 'react';
import NoResults from './NoResults';


type ListProps<T> = {
    // Data can either be an Object.entries result or the raw JSON object;
    // perhaps this is an unideal implementation.
    data: [string, T][] | {[key: string]: T},
    filter: ([id, value]: [string, T]) => boolean,
    map: ([id, value]: [string, T]) => JSX.Element,
    sort: ([idA, valueA]: [string, T], [idB, valueB]: [string, T]) => number,
    pinned: string[],
    groupBy?: keyof T
}

// A higher order list component of type T where T is the type of the JSON representation of a list value
// (ex: Club, Staff, `{ new: true, name: "United Computations", ... }`).
// List accepts the raw data as either the entire JSON file (`{[key: string]: T}`) or already subjected to Object.entries
// (`[string, T][]` to be compatible with Club tab data filtering).
// A compatible `map` callback is used to map T to JSX elements and render the component, while `filter` filters the
// sorted T array based on user queries.
// Pinned items (given as a string[] of IDs) are displayed in a separate category above other results.
export default function List<T>(props: ListProps<T>) {
    // Filter and map are different for each list, so pass them in as props
    const {data, filter, map, sort, pinned: pinnedIds, groupBy} = props;
    const [{pinned, unpinned, grouped}, setContent] = useState(parseContent());

    // Maps content to JSX components, sorting, filtering, and splitting by pinned and unpinned.
    function parseContent() {
        // Parse data into mappable form
        const parsed = Array.isArray(data)
            ? data.sort(sort) // If data has been subject to Object.entries already, sort it.
            : Object.entries(data).sort(sort); // Otherwise, sort the result of Object.entries on the JSON.

        // Filter out pinned components and display separately.
        // TODO: this can probably be done more efficiently
        const pinnedContent = parsed.filter(([id, value]) => pinnedIds.includes(id));
        const unpinnedContent = parsed.filter(([id, value]) => !pinnedIds.includes(id));

        const groupedContent = groupBy ? unpinnedContent.reduce((clubs, [id, club]) => {
            const group = club[groupBy] as string;
            if (!clubs[group]) clubs[group] = [];
            clubs[group].push([id, club]);
            return clubs;
        }, {} as Record<string, [string, T][]>) : {};

        return {
            pinned: pinnedContent.filter(filter).map(map),
            unpinned: unpinnedContent.filter(filter).map(map),
            grouped: Object.entries(groupedContent).map(([group, clubs]) => [
                group,
                clubs.filter(filter).map(map)
            ])
        };
    }

    // Rerender content when data or query changes.
    useEffect(() => {
        startTransition(() => {
            setContent(parseContent());
        });
    }, [data, filter])


    return unpinned.length || pinned.length ? (<>
        {pinned.length > 0 && (
            <MaterialList>
                {pinned}
            </MaterialList>
        )}
        {unpinned.length > 0 && pinned.length > 0 && <hr/>}
        {groupBy ? grouped.map(([group, clubs]) => (
            clubs.length > 0 && (
                <>
                    <p className="mt-2 pl-2 text-secondary text-2xl font-bold">{group}</p>
                    <hr className="mx-2 mt-2 mb-0" />
                    <MaterialList>
                        {clubs}
                    </MaterialList>
                </>
            )
        )) : (
            unpinned.length > 0 && (
                <MaterialList>
                    {unpinned}
                </MaterialList>
            )
        )}
    </>) : (
        <NoResults/>
    );
}

function MaterialList(props: {children: ReactNode}) {
    return (
        <ul className="grid grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))] list-none">
            {props.children}
        </ul>
    )
}
