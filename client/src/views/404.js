import React from 'react';
import {Link} from 'react-router-dom';

const PageNotFound = (props) => {
    return (
        <div>
            <h2>Page not found! Check your URL and try again?</h2>
            <Link to='/'>Go home</Link>
        </div>
    )
}

export default PageNotFound;