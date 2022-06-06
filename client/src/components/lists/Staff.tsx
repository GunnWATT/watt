import {useContext, useState} from 'react';
import {DateTime} from 'luxon';
import UserDataContext from '../../contexts/UserDataContext';

// Components
import Search from '../layout/Search';
import List from './List';
import StaffComponent, {ClassObj, SemesterClassObj, Staff as StaffComponentProps} from './StaffComponent';

// Data
import staff from '../../data/staff';


export default function Staff() {
    const {timestamp, data} = staff;

    const userData = useContext(UserDataContext)
    const [query, setQuery] = useState('');

    // Parses last names to find the preferred last name by matching it with the staff email
    const preferredLastName = (staff: StaffComponentProps) => {
        const {name, email} = staff;

        // Replaces dashes with spaces to prevent matching Barba-Medina to nmedina (instead individually matching barba and medina)
        // Removes apostrophes to prevent matching O'Connell with coconnell
        const lastNames = name.replace('-', ' ').replace('\'', '').split(' ').slice(1);

        for (const lastName of lastNames) {
            if (email?.match(lastName.toLowerCase())) return lastName;
        }

        // If no match is found, return the first last name
        return lastNames[0];
    }

    // Checks if a query matches a name of a class taught by a teacher to allow searching by classes
    const classInQuery = (staff: StaffComponentProps) => {
        if (!staff.periods) return false;

        for (const per of Object.values(staff.periods)) {
            if (searchClasses(per['1']) || searchClasses(per['2'])) return true;
        }
        return false;
    }

    // Checks if a query matches a given class object
    const searchClasses = (classes: ClassObj) => {
        // Hackily determine what type classes is
        if (typeof classes === 'object' && !Array.isArray(classes))
            return searchInner(classes['1']) || searchInner(classes['2']);
        return searchInner(classes);
    }

    // Checks if a query matches a given semester class
    const searchInner = (semClass: SemesterClassObj) => {
        if (semClass === 'none') return false;
        return semClass[0].toLowerCase().includes(query.toLowerCase());
    }

    return (
        <>
            <span className="flex gap-4 items-center">
                <h1>Staff</h1>
                <Search
                    placeholder="Search Staff"
                    onChange={e => setQuery(e.target.value)}
                />
            </span>
            <p className="mb-4 secondary">
                Please note that staff information was taken from{' '}
                <a href="https://www.parentsquare.com/api/v2/schools/6272/directory" target="_blank" rel="noopener noreferrer">ParentSquare</a> and the{' '}
                <a href="https://gunn.pausd.org/connecting/staff-directory" target="_blank" rel="noopener noreferrer">Gunn website</a>{' '}
                as of {DateTime.fromISO(timestamp).toLocaleString(DateTime.DATE_FULL)}. Attribute inaccuracies to them.
            </p>
            <List
                data={data}
                filter={([id, staff]) =>
                    query === ''
                    || staff.name.toLowerCase().includes(query.toLowerCase())
                    || (staff.title && staff.title.toLowerCase().includes(query.toLowerCase()))
                    || (staff.dept && staff.dept.toLowerCase().includes(query.toLowerCase()))
                    || (staff.email && staff.email.toLowerCase().includes(query.toLowerCase()))
                    || classInQuery(staff)
                }
                map={([id, staff]) => (
                    <StaffComponent
                        key={id}
                        id={id}
                        {...staff}
                    />
                )}
                sort={([idA, staffA], [idB, staffB]) => preferredLastName(staffA).localeCompare(preferredLastName(staffB))}
                pinned={userData.staff}
            />
        </>
    );
}
