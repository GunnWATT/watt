import React from 'react';


const NotSignedIn = () => {
    return (
        <div className="WIP">
            <span>
                <h2>You are not signed in!</h2>
                <p>
                    WATT requires your google account to store user preferences and relevant data.{' '}
                    Sign in using the button on the sidebar.
                </p>
            </span>
        </div>
    )
}

export default NotSignedIn;