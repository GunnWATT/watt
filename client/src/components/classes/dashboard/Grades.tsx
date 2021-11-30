import { useState, useContext } from "react";
import UserDataContext from "../../../contexts/UserDataContext";
import { findClassesList } from "../../../views/Classes";
import { classifyGrade } from "../functions/GeneralHelperFunctions";

const DashGrades = (props: { selected: string, allGrades: { [key: string]: number } }) => {
    const { allGrades, selected } = props;
    const [revealed, setRevealed] = useState(false);
    const userData = useContext(UserDataContext);

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

    return <div>
        <div className={"dashboard-header"}>Grades</div>
        <div onClick={() => !revealed ? setRevealed(true) : null} className={"dashboard-grade" + (revealed ? '' : ' dashboard-grade-hidden')}>
            Your grade is {classifyGrade(allGrades[selected])} • {allGrades[selected]}%.
            <div className="dashboard-grade-hide"><div onClick={() => setRevealed(false)}>Click to Hide</div></div>
        </div>
    </div>
}

export default DashGrades;