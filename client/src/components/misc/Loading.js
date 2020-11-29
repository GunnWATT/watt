import React from 'react';
import {Spinner} from 'reactstrap';

const Loading = (props) => {
    return (
        <div className="loading">
            <span>
                <Spinner/>
                <h2>Loading content...</h2>
            </span>
        </div>
    )
}

export default Loading;