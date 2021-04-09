import React, {useContext, useState} from "react";
import UserDataContext from '../../contexts/userDataContext';

// Components
import List from './List';
import StaffComponent, {ClassObj, SemesterClassObj, Staff as StaffComponentProps} from './StaffComponent';

// Data
import staff from '../../data/staff';


const Staff = () => {
    const userData = useContext(UserDataContext)
    const [query, setQuery] = useState('');

    // Parses last names to find the preferred last name by matching it with the staff email
    const preferredLastName = (staff: StaffComponentProps) => {
        let {name, email} = staff;

        // Replaces dashes with spaces to prevent matching Barba-Medina to nmedina (instead individually matching barba and medina)
        // Removes apostrophes to prevent matching O'Connell with coconnell
        let lastNames = name.replace('-', ' ').replace('\'', '').split(' ').slice(1);

        for (let lastName of lastNames) {
            let lower = lastName.toLowerCase();
            if (email.match(lower)) return lastName;
        }

        // If no match is found, return the first last name
        return lastNames[0];
    }

    // Checks if the query matched a name of a class taught by the teacher to allow searching by classes
    const classInQuery = (query: string, staff: StaffComponentProps) => {
        if (!staff.periods) return false;

        const searchInner = (semClass: SemesterClassObj) => {
            if (semClass === 'none') return false;
            return semClass[0].toLowerCase().includes(query);
        }

        const searchClasses = (classes: ClassObj) => {
            // Hackily determine what type classes is
            if (typeof classes === 'object' && !Array.isArray(classes))
                return searchInner(classes['1']) || searchInner(classes['2']);
            return searchInner(classes);
        }

        for (const per in ['1', '2', '3', '4', '5', '6', '7', '8']) {
            const classTaught = staff.periods[per];
            if (classTaught && (searchClasses(classTaught['1']) || searchClasses(classTaught['2']))) return true;
        }
        return false;
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
                    || classInQuery(query.toLowerCase(), staff)
                }
                map={([id, staff]) =>
                    <StaffComponent
                        key={id}
                        name={staff.name}
                        title={staff.title}
                        dept={staff.dept}
                        phone={staff.phone}
                        email={staff.email}
                        periods={staff.periods}
                    />
                }
                sort={([idA, staffA], [idB, staffB]) => preferredLastName(staffA).localeCompare(preferredLastName(staffB))}
                pinned={userData?.staff ?? []}
            />
        </>
    );
}

export default Staff;
