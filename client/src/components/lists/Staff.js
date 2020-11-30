import React, {useState} from "react";

// Components
import List from './List';

// Data
import staff from "../../data/staff";
import StaffComponent from "./StaffComponent";


const Staff = (props) => {
    const [query, setQuery] = useState('');

    return (
        <>
            <input
                type="search"
                placeholder="Search Staff"
                onChange={e => setQuery(e.target.value)}
            />
            <List
                data={staff}
                filter={([id, staff]) =>
                    query === '' ||
                    staff.name.toLowerCase().includes(query.toLowerCase())
                    || staff.title.toLowerCase().includes(query.toLowerCase())
                    || staff.email.toLowerCase().includes(query.toLowerCase())
                }
                map={([id, staff]) =>
                    <StaffComponent
                        key={id}
                        name={staff.name}
                        title={staff.title}
                        department={staff.department}
                        phone={staff.phone}
                        email={staff.email}
                        periods={staff.periods}
                    />
                }
                sort={([idA, staffA], [idB, staffB]) => staffA.name.localeCompare(staffB.name)}
            />
        </>
    );
}

export default Staff;
