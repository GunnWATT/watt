import {startTransition, useContext, useEffect, useState} from 'react';

// Components
import Material from '../../components/classes/Material';
import ClassFilter, {QueryObj} from '../../components/classes/ClassFilter';
import NoResults from '../../components/lists/NoResults';

// Contexts
import UserDataContext from '../../contexts/UserDataContext';
import SgyDataContext from '../../contexts/SgyDataContext';

// Utilities
import { similarity } from '../../util/sgyHelpers';
import {AssignmentBlurb} from '../../util/sgyAssignments';
import {getMaterials} from '../../util/sgyMaterials';


export default function Materials() {
    const { sgyData, selected, classes } = useContext(SgyDataContext);

    // Userdata handling
    const userData = useContext(UserDataContext);

    // Filter
    const [filter, setFilter] = useState<QueryObj>({
        query: '', labels: [], classes: Array(classes.length - 1).fill(false)
    });

    // Materials
    const [materials, setMaterials] = useState<AssignmentBlurb[] | null> (null);
    const [content, setContent] = useState<JSX.Element[] | null>(null);

    useEffect(() => {
        setMaterials(getMaterials(sgyData, selected, userData));
    }, [selected, userData]);

    useEffect(() => {
        startTransition(() => {
            setContent(materials && materials
                .filter((assi) => filter.query.length === 0
                    || similarity(filter.query, assi.name) >= 0.8
                    || similarity(filter.query, assi.description) >= 0.8)
                .filter((assi) => filter.classes.every(c => !c) ||
                    filter.classes[classes.findIndex(({ period }) => assi.period === period) - 1])
                .filter((assi) => !filter.labels.length ||
                    assi.labels.some(label => filter.labels.includes(label)))
                .map((item) => <Material key={item.id} item={item} />))
        });
    }, [materials, filter])

    return (
        <div className="flex flex-col gap-2">
            <ClassFilter filter={filter} setFilter={setFilter} />
            <section className="flex flex-col gap-1.5">
                {content && content.length ? content : <NoResults />}
            </section>
        </div>
    );
}
