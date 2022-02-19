import {useState} from 'react';


export default function Calculator() {
    const [currGrade, setCurrGrade] = useState('95.00');
    const [finalsWorth, setFinalsWorth] = useState('15.00');
    const [minGrade, setMinGrade] = useState('90.00');

    // Takes in variables and calculates minimum finals score
    const calculateFinalsGrade = () => {
        if (Number(finalsWorth) === 0) return <p>The final cannot be worth 0%.</p>;
        if (Number(finalsWorth) > 100) return <p>The final cannot be worth more than 100% of your grade.</p>

        let percentCurrGrade = Number(currGrade) / 100;
        let percentFinalsWorth = Number(finalsWorth) / 100;
        let percentMinGrade = Number(minGrade) / 100;
        let result = Math.round(((percentMinGrade - percentCurrGrade * (1 - percentFinalsWorth)) / percentFinalsWorth) * 10000) / 100;

        if (result <= 0) return <p>You <strong>don't need to study</strong>; even if you score 0%, you'll be above your
            threshold.</p>;
        return <p>
            You will need to score at least <strong>{result}%</strong> to keep your parents happy.
            {result > 100 ? ' If there\'s no extra credit, you\'re screwed.' : null}
        </p>
    }

    return (
        <>
            <h1>Minimum finals score calculator</h1>
            <hr/>
            <p>
                Current grade:{' '}
                <span className="percent-wrapper">
                    <input
                        type="text"
                        id="current-grade"
                        value={currGrade}
                        onChange={(e) => {
                            !isNaN(Number(e.target.value)) && setCurrGrade(e.target.value);
                        }}
                    />
                    <span>%</span>
                </span>
            </p>
            <p>
                Portion of grade the final determines:{' '}
                <span className="percent-wrapper">
                    <input
                        type="text"
                        id="finals-worth"
                        value={finalsWorth}
                        onChange={(e) => {
                            !isNaN(Number(e.target.value)) && setFinalsWorth(e.target.value);
                        }}
                    />
                    <span>%</span>
                </span>
            </p>
            <p>
                Minimum acceptable grade:{' '}
                <span className="percent-wrapper">
                    <input
                        type="text"
                        id="minimum-grade"
                        value={minGrade}
                        onChange={(e) => {
                            !isNaN(Number(e.target.value)) && setMinGrade(e.target.value);
                        }}
                    />
                    <span>%</span>
                </span>
            </p>
            {calculateFinalsGrade()}
        </>
    );
}
