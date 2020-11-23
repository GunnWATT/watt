// React, reactstrap
import React, {useState} from 'react';


// Higher order List component for clubs and staff now that they are separate

const List = (props) => {
    // Filter and map are different for each list, so pass them in as props
    let {data, query, filter, map} = props;

    // Parses data into mappable form
    let content;
    if (Array.isArray(data)) {
        // Assuming this has been subjected to Object.entries already
        content = data.sort();
    } else {
        // Creates nested array where [0] is the name and [1] is the object data
        content = Object.entries(data).sort();
    }

    // Filter via query, map to components
    content = content.filter(filter).map(map);

    /*
    filtered = filtered.filter(([key, value]) =>
        query === '' ||
        key.toLowerCase().includes(query.toLowerCase())
        || value.title.toLowerCase().includes(query.toLowerCase())
        || value.email.toLowerCase().includes(query.toLowerCase())
    )
    content = filtered.map(([name, info]) =>
        <StaffComponent
            key={name}
            name={name}
            title={info.title}
            department={info.department}
            phone={info.phone}
            email={info.email}
            periods={info.periods}
        />
    )
    */

    return (
        <ul className="material-list">
            {content}
        </ul>
    );
}

export default List;