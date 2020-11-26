// React, reactstrap
import React, {useState} from 'react';

import NoResults from "./NoResults";


// Higher order List component for clubs and staff now that they are separate

const List = (props) => {
    // Filter and map are different for each list, so pass them in as props
    let {data, filter, map, sort} = props;

    // Parses data into mappable form
    let content;
    if (Array.isArray(data)) {
        // Assuming this has been subjected to Object.entries already
        content = data.sort(sort);
    } else {
        // Creates nested array where [0] is the id and [1] is the object data
        content = Object.entries(data).sort(sort);
    }

    // Filter via query, map to components
    content = content.filter(filter).map(map);

    return (
        content.length
            ? <ul className="material-list">
                {content}
              </ul>
            : <NoResults/>
    );
}

export default List;