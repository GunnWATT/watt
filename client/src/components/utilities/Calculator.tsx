import React, {useState} from 'react';
import {Container} from 'reactstrap';

const Calculator = () => {
    const [currGrade, setCurrGrade] = useState(95.00);
    const [finalsWorth, setFinalsWorth] = useState(15.00);
    const [minGrade, setMinGrade] = useState(90.00);

    // Takes in variables and calculates minimum finals score
    const calculateFinalsGrade = () => {
        if (Number(finalsWorth) === 0) return <p>The final cannot be worth 0%!</p>;

        let percentCurrGrade = currGrade / 100;
        let percentFinalsWorth = finalsWorth / 100;
        let percentMinGrade = minGrade / 100;
        let result = Math.round(((percentMinGrade - percentCurrGrade * (1 - percentFinalsWorth)) / percentFinalsWorth) * 10000) / 100;

        if (result <= 0) return <p>You <strong>don't need to study</strong>; even if you score 0%, you'll be above your
            threshold.</p>;
        return <p>
            You will need to score at least <strong>{result}%</strong> to keep your parents happy.
            {result > 100 ? ' If there\'s no extra credit, you\'re screwed.' : null}
        </p>
    }

    return (
        <Container>
            <h1>Minimum finals score calculator</h1>
            <hr/>
            <p>
                Current grade:{' '}
                <span className="percent-wrapper" data-l10n-arg="input">
                        <input
                            type="text"
                            id="current-grade"
                            value={currGrade}
                            onChange={(e) => setCurrGrade(Number(e.target.value))}
                        />
                        <span>%</span>
                    </span>
            </p>
            <p>
                Portion of grade the final determines:{' '}
                <span className="percent-wrapper" data-l10n-arg="input">
                        <input
                            type="text"
                            id="finals-worth"
                            value={finalsWorth}
                            onChange={(e) => setFinalsWorth(Number(e.target.value))}
                        />
                        <span>%</span>
                    </span>
            </p>
            <p>
                Minimum acceptable grade:{' '}
                <span className="percent-wrapper" data-l10n-arg="input">
                        <input
                            type="text"
                            id="minimum-grade"
                            value={minGrade}
                            onChange={(e) => setMinGrade(Number(e.target.value))}
                        />
                        <span>%</span>
                    </span>
            </p>
            {calculateFinalsGrade()}
        </Container>
    );
}

export default Calculator;