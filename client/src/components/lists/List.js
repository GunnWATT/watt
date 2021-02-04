import React, {useState, useEffect} from 'react';
import NoResults from "./NoResults";


// Higher order List component for clubs and staff now that they are separate

const List = (props) => {
    // Filter and map are different for each list, so pass them in as props
    let {data, filter, map, sort} = props;

    const [content, setContent] = useState([]);

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

        // Filter via query, map to components
        setContent(newContent.filter(filter).map(map));
    }, [data, filter])

    return (
        content.length
            ? <ul className="material-list">
                {content}
              </ul>
            : <NoResults/>
    );
}

export default List;