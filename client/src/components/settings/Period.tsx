import React from 'react';
import {SgyPeriodData} from '../../contexts/UserDataContext';


type PeriodProps = {id: string, data: SgyPeriodData};
const Period = (props: PeriodProps) => {
    const {id, data} = props;
    const {n, c, l, o, s} = data;

    return (
        <span>
            {id}
            {n}
            {l}
            {/* o */}
        </span>
    );
}

export default Period;