import React from 'react';

const Clock = (props) => {
    return (
        <div>
            <h1 className="text-center">It is {props.date.toLocaleTimeString()}.</h1>
        </div>
    );
}

export default Clock;