import {useState} from 'react';


export default function Calculator() {
    const [currGrade, setCurrGrade] = useState('95.00');
    const [finalsWorth, setFinalsWorth] = useState('15.00');
    const [minGrade, setMinGrade] = useState('90.00');

    // Returns the message corresponding to the current grade values
    const calculateFinalsGrade = () => {
        if (Number(finalsWorth) === 0) return <p>The final cannot be worth 0%.</p>;
        if (Number(finalsWorth) > 100) return <p>The final cannot be worth more than 100% of your grade.</p>

        const percentCurrGrade = Number(currGrade) / 100;
        const percentFinalsWorth = Number(finalsWorth) / 100;
        const percentMinGrade = Number(minGrade) / 100;
        const result = Math.round(((percentMinGrade - percentCurrGrade * (1 - percentFinalsWorth)) / percentFinalsWorth) * 10000) / 100;

        return result <= 0 ? (
            <p>
                You <strong>don't need to study</strong>; even if you score 0%, you'll be above your
                threshold.
            </p>
        ) : (
            <p>
                You will need to score at least <strong>{result}%</strong> to keep your parents happy.
                {result > 100 && ' If there\'s no extra credit, you\'re screwed.'}
            </p>
        )
    }

    return (
        <>
            <h1>Minimum finals score calculator</h1>
            <hr/>
            <CalculatorInput
                label="Current grade:"
                value={currGrade}
                setValue={setCurrGrade}
            />
            <CalculatorInput
                label="Portion of grade the final determines:"
                value={finalsWorth}
                setValue={setFinalsWorth}
            />
            <CalculatorInput
                label="Minimum acceptable grade:"
                value={minGrade}
                setValue={setMinGrade}
            />
            {calculateFinalsGrade()}
        </>
    );
}

type CalculatorInputProps = {label: string, value: string, setValue: (value: string) => void};
function CalculatorInput(props: CalculatorInputProps) {
    const {label, value, setValue} = props;

    return (
        <p className="mb-4 flex flex-wrap gap-2">
            {label}
            <span className="relative">
                <input
                    type="text"
                    className="rounded w-48 bg-content-secondary dark:bg-content-secondary-dark px-2 py-1 pr-7"
                    value={value}
                    onChange={(e) => !isNaN(Number(e.target.value)) && setValue(e.target.value)}
                />
                <span className="secondary absolute top-1 right-2">%</span>
            </span>
        </p>
    )
}
