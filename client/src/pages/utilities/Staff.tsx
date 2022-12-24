import {useContext, useState} from 'react';
import {DateTime} from 'luxon';
import UserDataContext from '../../contexts/UserDataContext';

// Components
import {SectionHeader} from '../../components/layout/HeaderPage';
import Search from '../../components/layout/Search';
import List from '../../components/lists/List';
import StaffComponent from '../../components/lists/StaffComponent';

// Data
import staff, {Staff as StaffComponentProps} from '@watt/shared/data/staff';


export default function Staff() {
    const {timestamp, data} = staff;

    const userData = useContext(UserDataContext)
    const [query, setQuery] = useState('');

    // Parses last names to find the preferred last name by matching it with the staff email
    const preferredLastName = (staff: StaffComponentProps) => {
        const {name, email} = staff;

        // Replaces dashes with spaces to prevent matching Barba-Medina to nmedina (instead individually matching barba and medina)
        // Removes apostrophes to prevent matching O'Connell with coconnell
        const names = name.replace('-', ' ').replace('\'', '').split(' ');
        if (names.length === 1) return name; // If there's no last name (ex. "Kitchen"), return the full name.
        const lastNames = names.slice(1);

        // Find the preferred last name by matching it against the email. If no match is found, return the first
        // last name instead.
        for (const lastName of lastNames) {
            if (email?.match(lastName.toLowerCase())) return lastName;
        }
        return lastNames[0];
    }

    return (
        <>
            <span className="flex gap-4 items-center mb-1">
                <SectionHeader>Staff</SectionHeader>
                <Search
                    placeholder="Search Staff"
                    onChange={e => setQuery(e.target.value)}
                />
            </span>
            <p className="mb-4 text-secondary">
                Please note that staff information was taken from the{' '}
                <a href="https://gunn.pausd.org/connecting/staff-directory" target="_blank" rel="noopener noreferrer">Gunn website</a>{' '}
                as of {DateTime.fromISO(timestamp).toLocaleString(DateTime.DATE_FULL)}. Attribute inaccuracies to them.
            </p>
            <List
                data={data}
                filter={([id, staff]) =>
                    query === ''
                    || staff.name.toLowerCase().includes(query.toLowerCase())
                    || (staff.title && staff.title.toLowerCase().includes(query.toLowerCase()))
                    || (staff.email && staff.email.toLowerCase().includes(query.toLowerCase()))
                    || staff.dept.toLowerCase().includes(query.toLowerCase())
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
