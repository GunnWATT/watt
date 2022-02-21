import { useState } from 'react';
import { Alert, Button } from 'reactstrap';


type DayAlertProps = {daysRelToCur: number, jumpToPres: () => void};
export default function DayAlert(props: DayAlertProps) {
    const {daysRelToCur: days, jumpToPres} = props;

    const [visible, setVisible] = useState(true);
    const onDismiss = () => setVisible(false);

    const makeDateString = () => {
        const absDays = Math.abs(days);
        const newer = days > 0;

        if (absDays === 1) return newer
            ? 'You are viewing tomorrow\'s schedule.'
            : 'You are viewing yesterday\'s schedule.';
        return newer
            ? `You are viewing a schedule for ${absDays} days from now.`
            : `You are viewing a schedule from ${absDays} days ago.`;
    }

    return (
        <Alert
            className="day-alert absolute left-0 right-0 flex items-center mb-4 mx-auto shadow-lg border-none rounded px-5 py-3"
            isOpen={visible}
            toggle={onDismiss}
        >
            {makeDateString()}{' '}
            <button className="ml-auto" onClick={jumpToPres}>JUMP TO PRESENT</button>
        </Alert>
    );
}
