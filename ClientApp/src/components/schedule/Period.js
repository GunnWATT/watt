import React from 'react';
//import moment from 'moment';
import twix from 'twix';
import {Card, CardBody, CardTitle, CardSubtitle, CardText, Progress} from "reactstrap";

const Period = (props) => {
    // Outer time
    let now = props.now;

    // Inner time
    let start = props.start; // Moment representing start time
    let end = props.end; // Moment representing end time
    let t = start.twix(end); // Twix duration representing the period

    const parseStartEnd = () => {
        if (t.isPast()) return <span>Ended {end.fromNow()}</span>
        if (t.isCurrent()) return <span>Ending {end.fromNow()}, started {start.fromNow()}</span>
        if (t.isFuture()) return <span>Starting {start.fromNow()}</span>
    }

    return (
        <Card>
            <CardBody>
                <CardTitle>{props.name}</CardTitle>
                <CardSubtitle className="secondary">{t.simpleFormat('h:mma')}</CardSubtitle>
                <CardText className="secondary">{parseStartEnd()} - {t.countInner('minutes')} minutes long</CardText>
                {t.isCurrent()
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