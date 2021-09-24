import { useState } from "react";
import linkimg from '../../assets/link.png';

const Dashboard = (props: {}) => {

    // Mock array
    const classesArray = [
        {
            course: "Class Name 1",
            teacher: "McGinn",
            color: "#f4aeafff",
            link: "./",
            grade: "B+"
        }, {
            course: "Class Name 2",
            teacher: "Paronable",
            color: "#aef4dcff",
            link: "./",
            grade: "B+"
        }, {
            course: "Class Name 3",
            teacher: "Kinyanjui",
            color: "#aedef4ff",
            link: "./",
            grade: "B+"
        }, {
            course: "Class Name 4",
            teacher: "Paley",
            color: "#aeaff4ff",
            link: "./",
            grade: "B+"
        }, {
            course: "Class Name 5",
            teacher: "MATCHETT",
            color: "#f4dcaeff",
            link: "./",
            grade: "B+"
        }, {
            course: "Class Name 6",
            teacher: "Little",
            color: "#aff4aeff",
            link: "./",
            grade: "B+"
        }, {
            course: "Class Name 7",
            teacher: "GLEASON",
            color: "#f4f3aeff",
            link: "./",
            grade: "B+"
        }
    ]


    // Selected
    const [selected, setSelected] = useState(-1);

    const warnings = [
        {
            name: "Assignment A",
            link: "./"
        },
        {
            name: "Assignment B",
            link: "./"
        }
    ];

    const upcoming = [
        {
            day: "Tuesday, October 6",
            upcoming: [
                {
                    name: "Assignment A",
                    link: "./"
                },
                {
                    name: "Assignment B",
                    link: "./"
                }
            ]
        },
        {
            day: "Wednesday, October 7",
            upcoming: [
                {
                    name: "Assignment A",
                    link: "./"
                },
                {
                    name: "Assignment B",
                    link: "./"
                }
            ]
        }
    ]

    return (
        <div className="dashboard">
            <div className="dashboard-class-list">
                <div onClick={() => setSelected(-1)} className="dashboard-course" style={{ backgroundColor: "#bbbbbb" }}>All Classes</div>
                {classesArray.map(({ course, teacher, color }, i) => {
                    return <div key={course} onClick={() => setSelected(i)} className="dashboard-course" style={{ backgroundColor: color }}>{course}</div>;
                })}
            </div>
            <div className="dashboard-class-info">
                {selected === -1 ?
                    <div className="dashboard-class-header">
                        <div className="dashboard-class-title">All Classes</div>
                    </div>
                    :
                    <div className="dashboard-class-header">
                        <div className="dashboard-class-title">{classesArray[selected].course}</div>
                        {/* a B?? :hypereyes: */}
                        <div className="dashboard-class-grade">{classesArray[selected].grade}</div>
                        <a href={classesArray[selected].link}><img src={linkimg} className="dashboard-class-link"/></a>
                    </div>
                }
        
                <div className="dashboard-warnings">
                    <div className="dashboard-warnings-header">Warnings</div>
                    <ul className="dashboard-warnings-list">
                        {
                            warnings.map(({ name, link }) => <li key={name + link}><a href={link}>{name}</a></li>)
                        }
                    </ul>
                </div>
                <div className="dashboard-upcoming">
                    <div className="dashboard-upcoming-header">Upcoming</div>
                    <div className="dashboard-upcoming-container">
                        {
                            upcoming.map(({ day, upcoming }) =>
                                <div className="dashboard-upcoming-day">
                                    <div className="dashboard-upcoming-day-header">{day}</div>
                                    <ul className="dashboard-upcoming-list">
                                        {upcoming.map(({ name, link }) => <li key={name + link}><a href={link}>{name}</a></li>)}
                                    </ul>
                                </div>)
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
