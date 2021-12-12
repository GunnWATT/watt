import { useContext, useEffect, useState } from 'react';

// Components
import Material from './Material';
import ClassFilter from './ClassFilter';

// Contexts
import UserDataContext, { SgyPeriod, SgyData } from '../../contexts/UserDataContext';
import SgyDataContext from '../../contexts/SgyDataContext';

// Utilities
import { findClassesList } from '../../views/Classes';
import { similarity } from './functions/GeneralHelperFunctions';
import { AssignmentBlurb, getMaterials, parseLabelColor } from './functions/SgyFunctions';


export default function Materials() {
    const sgyInfo = useContext(SgyDataContext);
    const { sgyData, selected } = sgyInfo;

    // Userdata handling
    const userData = useContext(UserDataContext);
    const classes = findClassesList(userData, false);

    // Filters
    const [classFilter, setClassFilter] = useState<boolean[]>(Array(classes.length).fill(true));
    const [query, setQuery] = useState('');

    // Materials
    const [materials, setMaterials] = useState<AssignmentBlurb[] | null> (null);

    useEffect(() => {
        setMaterials(getMaterials(sgyData, selected, userData));
    }, [selected, userData]);

    const content = materials && materials
        .filter((assi) => query.length === 0 || similarity(query, assi.name) >= 0.8 || similarity(query, assi.description) >= 0.8)
        .filter((assi) => classFilter[classes.findIndex(({ period }) => assi.period === period)])
        .map((item) => <Material key={item.id} item={item} sgyData={sgyData} />)

    return (
        <div className="materials">
            <input type="text" placeholder="Search" defaultValue={query} className="upcoming-search-bar" onChange={(event) => setQuery(event.target.value)} />
            <div className="materials-filters">
                <ClassFilter {...{ classFilter, setClassFilter, classes }} />
            </div>
            {content}
        </div>
    );
}
