import React from 'react';
import moment from 'moment';
import {Card, CardBody, CardTitle, CardSubtitle, CardText, Progress} from "reactstrap";

const Period = (props) => {
    let time = props.currTime; // necessary?
    let now = new moment();
    let start = new moment(`${time.format('L')} ${props.start}`, 'MM/DD/YYYY h:mm a');
    let end = new moment(`${time.format('L')} ${props.end}`, 'MM/DD/YYYY h:mm a');

    const parseStartEnd = () => {
        if (now.isAfter(end)) return <span>Ended {end.fromNow()}</span>
        if (now.isBetween(start, end)) return <span>Ending {end.fromNow()}, started {start.fromNow()}</span>
        if (now.isBefore(start)) return <span>Starting {start.fromNow()}</span>
    }

    return (
        <Card>
            <CardBody>
                <CardTitle>{props.name}</CardTitle>
                <CardSubtitle className="secondary">{props.start} - {props.end}</CardSubtitle>
                <CardText className="secondary">{parseStartEnd()}</CardText>
                {(now.isBetween(start, end))
                    ? <Progress animated value={(now.valueOf() - start.valueOf()) / (end.valueOf() - start.valueOf()) * 100}/>
                    : null}
            </CardBody>
        </Card>
        /*
        <div className="schedule-period">
            <span className="schedule-periodname">{props.name}</span>
            <span>{props.start} - {props.end}</span>
            {parseStartEnd()}
            {(now.isBetween(start, end))
                ? <Progress animated value={(now.valueOf() - start.valueOf()) / (end.valueOf() - start.valueOf()) * 100}/>
                : null}
        </div>
        */
    );
}

export default Period;