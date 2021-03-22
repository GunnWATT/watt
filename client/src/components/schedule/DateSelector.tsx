import React from 'react';
import DatePicker from 'react-datepicker';
import {Moment} from 'moment';
import 'react-datepicker/dist/react-datepicker.css';

// Icons
import {ChevronLeft, ChevronRight} from 'react-feather'


type DateSelectorProps = {incDay: () => void, decDay: () => void, setViewDate: (d: Date) => void, viewDate: Moment}
const DateSelector = ({incDay, decDay, setViewDate, viewDate}: DateSelectorProps) => {

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
                closeOnScroll={true}
                selected={viewDate.toDate()}
                onChange={(date: Date) => setViewDate(date)}
                todayButton="Jump to Present"
                dateFormat="MMMM d"
            />

            <button className="icon" onClick={incDay}>
                <ChevronRight/>
            </button>
        </div>
    );
}

export default DateSelector;
