import { useContext, useEffect, useState } from 'react';
import UpcomingPalette from './UpcomingPalette';

// Contexts
import UserDataContext, { SgyPeriod, SgyData } from '../../contexts/UserDataContext';

// Utilities
import { findClassesList } from '../../views/Classes';
import { parsePeriodColor } from '../schedule/Periods';
import { similarity } from './functions/GeneralHelperFunctions';
import { AssignmentBlurb, getMaterials, parseLabelColor } from './functions/SgyFunctions';


type MaterialProps = { item: AssignmentBlurb, sgyData: SgyData };
function Material(props: MaterialProps) {
    const { item, sgyData } = props;
    const userData = useContext(UserDataContext);

    return (
        <div
            className="material"
            onClick={() => {
                // console.log(sgyData[item.period].assignments.find(a => a.id+'' === item.id));
                console.log(item);
            }}
        >
            <div className="material-name">{item.name}</div>

            { item.timestamp && <div className="material-date"> {item.timestamp.format('M/D/YY')} </div> }

            <div className="material-labels">
                {item.labels.map(label => <div key={label} className="material-label" style={{backgroundColor: parseLabelColor(label, userData)}} />)}
            </div>
            <div className="material-class" style={{backgroundColor: parsePeriodColor(item.period, userData)}} />
        </div>
    );
}

type MaterialsProps = { sgyData: SgyData, selected: SgyPeriod|'A' };
export default function Materials(props: MaterialsProps) {
    const {sgyData, selected} = props;

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
    }, [selected]);

    // TODO: perhaps inline this in the returned JSX so that there doesn't have to be two null checks for materials
    const filteredMaterials = materials && materials
        .filter((assi) => query.length === 0 || similarity(query, assi.name) >= 0.8 || similarity(query, assi.description) >= 0.8)
        .filter((assi) => classFilter[classes.findIndex(({ period }) => assi.period === period)])

    return (
        <div className="materials">
            <input type="text" placeholder="Search" defaultValue={query} className="upcoming-search-bar" onChange={(event) => setQuery(event.target.value)} />
            <div className="materials-filters">
                <UpcomingPalette {...{ classFilter, setClassFilter, classes }} />
            </div>
            {filteredMaterials && filteredMaterials.map((item) => <Material key={item.id} item={item} sgyData={sgyData} />)}
        </div>
    );
}
