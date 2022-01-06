import { useState, useContext } from 'react';

// Context
import UserDataContext from '../../contexts/UserDataContext';
import SgyDataContext from '../../contexts/SgyDataContext';

// Utilities
import { findClassesList } from '../../views/Classes';
import { classifyGrade } from './functions/GeneralHelperFunctions';

// Icons
import { ChevronDown, ChevronRight, ChevronUp } from 'react-feather';


type GradesProps = { selected: string, allGrades: { [key: string]: number } };
export default function Grades(props: GradesProps) {
    const { allGrades, selected } = props;

    const [revealed, setRevealed] = useState(false);
    const userData = useContext(UserDataContext);
    const { sgyData } = useContext(SgyDataContext);

    if (selected !== 'A' && !allGrades[selected]) return null;

    const ExpandIcon = revealed ? ChevronDown : ChevronRight;

    return (
        <div>
            <h1 className="dashboard-header grades-header">
                Grades{' '}
                <ExpandIcon size={30} style={{ cursor: 'pointer' }} onClick={() => setRevealed(!revealed)} />
            </h1>

            <div hidden={!revealed} className="dashboard-grade">
                {selected === 'A' ? findClassesList(sgyData, userData)
                    .filter(({ period }) => period !== 'A' && allGrades[period])
                    .map(({ name, color, period }) => (

                    <div key={period} className="dashboard-grade-all">
                        <div className={"dashboard-grade-all-bubble"} style={{ backgroundColor: color }}>{period}</div>
                        <div>{classifyGrade(allGrades[period])} • {allGrades[period]}% • {name}</div>
                    </div>
                )) : (<>
                    Your grade is {classifyGrade(allGrades[selected])} • {allGrades[selected]}%.
                </>)}
            </div>
        </div>
    )
}
