import React, {useState} from "react";

// Components
import List from './List';

// Data
import staff from "../../data/staff";
import StaffComponent from "./StaffComponent";


const Staff = (props) => {
    const [query, setQuery] = useState('');

    const lastName = (name) => {
        let arr = name.split(' ');
        return arr[arr.length - 1];
    }

    return (
        <>
            <span className="heading">
                <h1>Staff</h1>
                <input
                    type="search"
                    placeholder="Search Staff"
                    onChange={e => setQuery(e.target.value)}
                />
            </span>
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
                sort={([idA, staffA], [idB, staffB]) => lastName(staffA.name).localeCompare(lastName(staffB.name))}
            />
        </>
    );
}

export default Staff;
