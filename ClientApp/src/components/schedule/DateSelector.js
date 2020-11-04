import React, {useState} from 'react';
import ReactDatetime from "react-datetime";

const DateSelector = (props) => {
    return (
        <p className="center">
            <button className="icon" onClick={props.decDay}>
                <svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z"/>
                    <path d="M0-.5h24v24H0z" fill="none"/>
                </svg>
            </button>

            {/* <ReactDatetime
                inputProps={{
                    placeholder: "Select Date"
                }}
                timeFormat={false}
            /> */}

            <button className="icon" onClick={props.incDay}>
                <svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"/>
                    <path d="M0-.25h24v24H0z" fill="none"/>
                </svg>
            </button>
        </p>
    );
}

export default DateSelector;