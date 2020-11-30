import React from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

// Icons
import {ChevronLeft, ChevronRight} from 'react-feather'


const DateSelector = (props) => {
    let {incDay, decDay, setViewDate, viewDate} = props

    return (
        <div className='date-selector'>
            <button className='icon' onClick={decDay}>
                <ChevronLeft/>
            </button>

            {/*
            <form noValidate>
                <input
                    id="date"
                    type="date"
                    value={date.format('YYYY-MM-DD')}
                    onChange={e => setViewDate(e.target.value)}
                />
            </form>
            */}
            <DatePicker
                selected={viewDate.toDate()}
                onChange={date => setViewDate(date)}
                todayButton="Jump to Present"
            />

            <button className="icon" onClick={incDay}>
                <ChevronRight/>
            </button>
        </div>
    );
}

export default DateSelector;
