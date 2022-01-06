import { useContext, useEffect, useState } from 'react';

// Components
import Material from './Material';
import ClassFilter, {QueryObj} from './ClassFilter';
import NoResults from '../lists/NoResults';

// Contexts
import UserDataContext, { SgyPeriod, SgyData } from '../../contexts/UserDataContext';
import SgyDataContext from '../../contexts/SgyDataContext';

// Utilities
import { findClassesList } from '../../views/Classes';
import { similarity } from './functions/GeneralHelperFunctions';
import {AssignmentBlurb, defaultLabels, getMaterials, parseLabelColor} from './functions/SgyFunctions';


export default function Materials() {
    const sgyInfo = useContext(SgyDataContext);
    const { sgyData, selected } = sgyInfo;

    // Userdata handling
    const userData = useContext(UserDataContext);
    const classes = findClassesList(sgyData, userData, false);

    // Filter
    const [filter, setFilter] = useState<QueryObj>({
        query: '', labels: [], classes: Array(classes.length).fill(false)
    });

    // Materials
    const [materials, setMaterials] = useState<AssignmentBlurb[] | null> (null);

    useEffect(() => {
        setMaterials(getMaterials(sgyData, selected, userData));
    }, [selected, userData]);

    const content = materials && materials
        .filter((assi) => filter.query.length === 0
            || similarity(filter.query, assi.name) >= 0.8
            || similarity(filter.query, assi.description) >= 0.8)
        .filter((assi) => filter.classes.every(c => !c) ||
            filter.classes[classes.findIndex(({ period }) => assi.period === period)])
        .filter((assi) => !filter.labels.length ||
            assi.labels.some(label => filter.labels.includes(label)))
        .map((item) => <Material key={item.id} item={item} sgyData={sgyData} />)

    return (
        <div className="materials">
            <ClassFilter filter={filter} setFilter={setFilter} classes={classes} />
            {content && content.length ? content : <NoResults />}
        </div>
    );
}
