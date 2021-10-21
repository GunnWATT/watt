import { useState } from 'react';
import { Alert, Button } from 'reactstrap';


type DayAlertProps = {daysRelToCur: number, jumpToPres: () => void};
export default function DayAlert(props: DayAlertProps) {
    const {daysRelToCur, jumpToPres} = props;

    const [visible, setVisible] = useState(true);
    const onDismiss = () => setVisible(false);

    let days = daysRelToCur;
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
            style={{
                position: 'absolute',
                left: 0,
                right: 0
            }}
        >
            {makeDateString()}{' '}
            <button onClick={jumpToPres}>JUMP TO PRESENT</button>
        </Alert>
    );
}
