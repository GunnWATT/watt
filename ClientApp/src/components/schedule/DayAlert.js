import React, { useState } from 'react';
import { Alert, Button } from 'reactstrap';

const DayAlert = (props) => {
    const [visible, setVisible] = useState(true);
    const onDismiss = () => setVisible(false);

    let days = props.daysRelToCur;
    let absDays = Math.abs(days);
    const makeDateString = () => {
        let newer = days > 0;
        let singular = absDays === 1;
        if (singular) {
            if (newer) return 'You are viewing tomorrow\'s schedule.';
            return 'You are viewing yesterday\'s schedule.';
        }
        if (newer) return `You are viewing a schedule for ${absDays} days from now.`; // Credit: Saumya for phrasing
        return `You are viewing a schedule from ${absDays} days ago.`;
    }

    return (
        <Alert
            className="day-alert"
            isOpen={visible}
            toggle={onDismiss}
        >
            {makeDateString()}{' '}
            <Button
                size="sm"
                onClick={props.jumpToPres}
            >JUMP TO PRESENT</Button>
        </Alert>
    );
}

export default DayAlert;