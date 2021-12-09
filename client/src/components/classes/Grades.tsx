import { useState, useContext } from 'react';

// Context
import UserDataContext from '../../contexts/UserDataContext';

// Utilities
import { findClassesList } from '../../views/Classes';
import { classifyGrade } from './functions/GeneralHelperFunctions';

type GradesProp = { selected: string, allGrades: { [key: string]: number } };
export default function Grades(props: GradesProp) {
    const { allGrades, selected } = props;

    const [revealed, setRevealed] = useState(false);
    const userData = useContext(UserDataContext);

    // TODO: the only difference between this rendered structure and the one at the end is in the section above the hide button;
    // Ideally we merge them into one via something like
    // const content = selected === 'A' ? ... : ...;
    // return <div>...{content}...</div>
    // but I am unsure if the `if` after this statement can be put before this statement without any issues.
    // Holding off on styling this render branch for this reason.
    if (selected === 'A') {
        const classes = findClassesList(userData).filter(({ period }) => period !== 'A'); // remove all classes from the classes list

        return <div>
            <div className={"dashboard-header"}>Grades</div>

            <div onClick={() => !revealed ? setRevealed(true) : null} className={"dashboard-grade" + (revealed ? '' : ' dashboard-grade-hidden')}>
                {classes.filter(({ period }) => allGrades[period]).map(({ name, color, period }) => <div key={period} className="dashboard-grade-all">
                    <div className={"dashboard-grade-all-bubble"} style={{ backgroundColor: color }}>{period}</div>
                    <div>{classifyGrade(allGrades[period])} • {allGrades[period]}% • {name}</div>
                </div>)}
                <div className="dashboard-grade-hide"><div onClick={() => setRevealed(false)}>Click to Hide</div></div>
            </div>
        </div>;
    }
    if (!allGrades[selected]) return null;

    return (
        <div>
            <div className="dashboard-header">Grades</div>
            <div onClick={() => !revealed && setRevealed(true)} className={"dashboard-grade" + (revealed ? '' : ' dashboard-grade-hidden')}>
                Your grade is {classifyGrade(allGrades[selected])} • {allGrades[selected]}%.
                <div className="dashboard-grade-hide">
                    <div onClick={() => setRevealed(false)}>Click to Hide</div>
                </div>
            </div>
        </div>
    )
}
