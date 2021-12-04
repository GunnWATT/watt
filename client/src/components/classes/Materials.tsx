import { useContext, useEffect, useState } from "react";
import UserDataContext, { SgyData } from "../../contexts/UserDataContext";
import { findClassesList } from "../../views/Classes";
import { parsePeriodColor } from "../schedule/Periods";
import { AssignmentBlurb, getMaterials, parseLabelColor } from "./functions/SgyFunctions";
import UpcomingPalette from "./upcoming/PaletteClassFilter";

const Material = ({ item, sgyData }: { item: AssignmentBlurb, sgyData: SgyData }) => {
    const userData = useContext(UserDataContext);

    return <div 
        className="material" 
        onClick={() => {
            console.log(sgyData[item.period].assignments.find(a => a.id+'' === item.id));
            console.log(item);
        }}
    >
        <div className="material-name">{item.name}</div>

        <div className="material-labels">
            {item.labels.map(label => <div key={label} className="material-label" style={{backgroundColor: parseLabelColor(label, userData)}} />)}
        </div>
        <div className="material-class" style={{backgroundColor: parsePeriodColor(item.period, userData)}} ></div>
    </div>
}
 
export const Materials = ({sgyData, selected}: { sgyData: SgyData, selected: string }) => {

    // Userdata handling
    const userData = useContext(UserDataContext);
    const classes = findClassesList(userData, false);

    // Filters
    const [classFilter, setClassFilter] = useState<boolean[]>(Array(classes.length).fill(true));
    const [query, setQuery] = useState('');

    // Materials
    const [materials, setMaterials] = useState<null | AssignmentBlurb[]> (null);

    useEffect(() => {
        setMaterials( getMaterials(sgyData, selected, userData) );
    }, [selected]);

    const filteredMaterials = materials && 
    materials.filter((assi) => {
        // query
        if (query.length === 0) return true;
        else {
            // TODO: include fuzzy matching
            return assi.name.toLowerCase().includes(query.toLowerCase()) || assi.description.toLowerCase().includes(query.toLowerCase());
        }
    })
    .filter((assi) => classFilter[classes.findIndex(({ period }) => assi.period === period)])

    return <div className="materials">
        <input type="text" placeholder="Search" defaultValue={query} className="upcoming-search-bar" onChange={(event) => setQuery(event.target.value)} />
        <div className="materials-filters">
            <UpcomingPalette {...{ classFilter, setClassFilter, classes }} />
        </div>
        {filteredMaterials && filteredMaterials.map((item) => <Material key={item.id} item={item} sgyData={sgyData} />)}
    </div>
}