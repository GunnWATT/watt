import React from 'react';
import {Spinner} from 'reactstrap';


const Loading = (props?: {message?:string}) => {

    const message = props && props.message ? props.message : `Loading content...`
    return (
        <div className="loading">
            <span>
                <Spinner/>
                <h2>{message}</h2>
            </span>
        </div>
    )
}

export default Loading;