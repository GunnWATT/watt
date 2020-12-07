import React, {useState} from "react";

// Components
import List from './List';

// Data
import staff from "../../data/staff";
import StaffComponent from "./StaffComponent";


const Staff = (props) => {
    const [query, setQuery] = useState('');

    // Parses last names to find the preferred last name by matching it with the staff email
    const preferredLastName = (staff) => {
        let {name, email} = staff;

        // Replaces dashes with spaces to prevent matching Barba-Medina to nmedina (instead individually matching barba and medina)
        // Removes apostrophes to prevent matching O'Connell with coconnell
        let lastNames = name.replace('-', ' ').replace('\'', '').split(' ').slice(1);

        for (let lastName of lastNames) {
            let lower = lastName.toLowerCase();
            if (email.match(lower)) return lastName;
        }
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
                sort={([idA, staffA], [idB, staffB]) => preferredLastName(staffA).localeCompare(preferredLastName(staffB))}
            />
        </>
    );
}

export default Staff;
