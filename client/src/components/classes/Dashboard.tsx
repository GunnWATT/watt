import React, { useState } from "react";
import linkimg from '../../assets/link.png';

const Dashboard = (props: {}) => {

    // Mock array
    const classesArray = [
        {
            course: "Class Name 1",
            teacher: "McGinn",
            color: "#f4aeafff"
        }, {
            course: "Class Name 2",
            teacher: "Paronable",
            color: "#aef4dcff"
        }, {
            course: "Class Name 3",
            teacher: "Kinyanjui",
            color: "#aedef4ff"
        }, {
            course: "Class Name 4",
            teacher: "Paley",
            color: "#aeaff4ff"
        }, {
            course: "Class Name 5",
            teacher: "MATCHETT",
            color: "#f4dcaeff"
        }, {
            course: "Class Name 6",
            teacher: "Little",
            color: "#aff4aeff"
        }, {
            course: "Class Name 7",
            teacher: "GLEASON",
            color: "#f4f3aeff"
        }
    ]


    // Selected
    const [selected,setSelected] = useState(0);

    return (
        <div className="dashboard">
            <div className="dashboard-class-list">
                {classesArray.map(({ course, teacher, color }) => {
                    return <div className="dashboard-course" style={{backgroundColor: color}}>{course}</div>;
                })}
            </div>
            <div className="dashboard-class-info">
                <div className="dashboard-class-header">
                    <div className="dashboard-class-title">{classesArray[selected].course}</div>
                    {/* a B?? :hypereyes: */}
                    <div className="dashboard-class-grade">B+</div>
                    <img src={linkimg} className="dashboard-class-link"></img>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
