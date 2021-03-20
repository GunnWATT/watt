import React from 'react';
import {Link} from 'react-router-dom';

const PageNotFound = () => {
    return (
        <div className="404">
            <h3>Page not found! Check your URL and try again?</h3>
            <Link to='/'>Go home</Link>
        </div>
    )
}

export default PageNotFound;