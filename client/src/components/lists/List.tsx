import React, {useState, useEffect} from 'react';
import NoResults from './NoResults';


type ListEntriesPair = [string, any]
type ListProps = {
    data: ListEntriesPair[] | {[key: string]: any}, // Data can either be an Object.entries result or the raw JSON
    filter: ([id, value]: ListEntriesPair) => boolean,
    map: ([id, value]: ListEntriesPair) => JSX.Element,
    sort: ([idA, valueA]: ListEntriesPair, [idB, valueB]: ListEntriesPair) => number
    pinned: string[]
}

// Higher order List component for clubs and staff now that they are separate
const List = (props: ListProps) => {
    // Filter and map are different for each list, so pass them in as props
    let {data, filter, map, sort, pinned} = props;

    const [content, setContent] = useState<JSX.Element[]>([]);
    const [pinnedContent, setPinnedContent] = useState<JSX.Element[]>([])

    // Renders content on mount and when data or query changes
    useEffect(() => {
        // Parses data into mappable form
        let newContent;

        if (Array.isArray(data)) {
            // Assuming this has been subjected to Object.entries already
            newContent = data.sort(sort);
        } else {
            // Creates nested array where [0] is the id and [1] is the object data
            newContent = Object.entries(data).sort(sort);
        }

        // Filter out pinned components and display separately
        // Can probably be done better
        let pinnedData = newContent.filter(([id, value]) => pinned.includes(id));
        let unpinnedData = newContent.filter(([id, value]) => !pinned.includes(id));

        // Filter each via query, map to components
        setContent(unpinnedData.filter(filter).map(map));
        setPinnedContent(pinnedData.filter(filter).map(map))
    }, [data, filter])


    // Render the HTML to be displayed
    // Can probably be done better
    const render = () => {
        let pinnedHTML = pinnedContent.length
            ? <ul className="material-list">
                {pinnedContent}
              </ul>
            : null
        let hr = content.length && pinnedContent.length ? <hr/> : null;
        let unpinnedHTML = content.length
            ? <ul className="material-list">
                {content}
              </ul>
            : null

        return (
            content.length || pinnedContent.length
                ? <>
                    {pinnedHTML}
                    {hr}
                    {unpinnedHTML}
                  </>
                : <NoResults/>
        );
    }

    return render();
}

export default List;