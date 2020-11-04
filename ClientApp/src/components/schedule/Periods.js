import React, {Component} from 'react';
import Period from './Period';

class Periods extends Component {
    constructor(props) {
        super(props);
        //this.state = { nextPeriod: {name: null, minutes: null, starting: true}};
    }

    normalSchedule = [
        null,
        [
            { name: 'A', start: [10, 0], end: [10, 30] },
            { name: 'B', start: [10, 40], end: [11, 10] },
            { name: 'C', start: [11, 20], end: [11, 50] },
            { name: 'D', start: [12, 0], end: [12, 35] },
            { name: 'Lunch', start: [12, 35], end: [13, 5] },
            { name: 'E', start: [13, 15], end: [13, 45] },
            { name: 'F', start: [13, 55], end: [14, 25] },
            { name: 'G', start: [14, 35], end: [15, 5] }
        ],
        [
            { name: 'A', start: [9, 0], end: [10, 15] },
            { name: 'B', start: [10, 25], end: [11, 40] },
            { name: 'Lunch', start: [11, 40], end: [12, 10] },
            { name: 'C', start: [12, 20], end: [13, 40] },
            { name: 'D', start: [13, 50], end: [15, 5] },
            { name: 'Flex', start: [15, 10], end: [15, 40] }
        ],
        [
            { name: 'E', start: [9, 40], end: [10, 55] },
            { name: 'GT', start: [11, 5], end: [11, 40] },
            { name: 'Lunch', start: [11, 40], end: [12, 10] },
            { name: 'F', start: [12, 20], end: [13, 40] },
            { name: 'G', start: [13, 50], end: [15, 5] },
            { name: 'Flex', start: [15, 10], end: [15, 40] }
        ],
        [
            { name: 'A', start: [9, 0], end: [10, 15] },
            { name: 'B', start: [10, 25], end: [11, 40] },
            { name: 'Lunch', start: [11, 40], end: [12, 10] },
            { name: 'C', start: [12, 20], end: [13, 40] },
            { name: 'D', start: [13, 50], end: [15, 5] },
            { name: 'Flex', start: [15, 10], end: [15, 40] }
        ],
        [
            { name: 'E', start: [9, 40], end: [10, 55] },
            { name: 'SELF', start: [11, 5], end: [11, 40] },
            { name: 'Lunch', start: [11, 40], end: [12, 10] },
            { name: 'F', start: [12, 20], end: [13, 40] },
            { name: 'G', start: [13, 50], end: [15, 5] }
        ],
        null
    ]

    // Takes '5' and returns '05'
    parseSingular = (num) => num < 10 ? `0${num}` : num;

    // Takes [9, 40] and returns 9:40am
    arrayToDate = (arr) => {
        let hours = arr[0];
        let minutes = arr[1];
        let suffix = 'am'
        if (hours >= 12) {
            if (hours !== 12) hours -= 12;
            suffix = 'pm';
        }
        return `${hours}:${this.parseSingular(minutes)}${suffix}`;
    }

    // Takes in an int representing a day of the week and renders the schedule corresponding to that
    renderSchedule = (day) => (
        !this.normalSchedule[day]
            ? this.weekend()
            : this.regSchoolDay(day)
    )

    render() {
        return this.renderSchedule(this.props.currTime.format('d'))
    }

    regSchoolDay = (day) => {
        let schedule = this.normalSchedule[day];
        return (
            <>
                <span className="schedule-end">School ends at <strong>{this.arrayToDate(schedule[schedule.length - 1].end)}</strong> today.</span>
                {schedule.map(period =>
                    <Period
                        name={period.name}
                        start={this.arrayToDate(period.start)}
                        end={this.arrayToDate(period.end)}
                        currTime={this.props.currTime}
                    />
                )}
            </>
        )
    }

    // Renders the HTML for the weekend
    weekend = () => (
        <div>
            <h1 className="center">No school today!</h1>
            <p className="center">
                <svg style={{margin: 'auto'}} width="300" height="300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M160 224v64h320v-64c0-35.3 28.7-64 64-64h32c0-53-43-96-96-96H160c-53 0-96 43-96 96h32c35.3 0 64 28.7 64 64zm416-32h-32c-17.7 0-32 14.3-32 32v96H128v-96c0-17.7-14.3-32-32-32H64c-35.3 0-64 28.7-64 64 0 23.6 13 44 32 55.1V432c0 8.8 7.2 16 16 16h64c8.8 0 16-7.2 16-16v-16h384v16c0 8.8 7.2 16 16 16h64c8.8 0 16-7.2 16-16V311.1c19-11.1 32-31.5 32-55.1 0-35.3-28.7-64-64-64z"/></svg>
            </p>
        </div>
    );

    // Renders the HTML for winter break
    // Much of how the code will handle breaks is still unknown, so work in progress
    winterBreak = () => (
        <div>
            <h1 className="center">Enjoy winter break!</h1>
            <img src="../../images/mountain.svg" alt="Mountain picture" />
        </div>
    )

    // Renders the HTML for winter break
    // Same concern as for winterBreak
    summerBreak = () => (
        <h1 className="center">Have a great summer!</h1>
    )
}

export default Periods;