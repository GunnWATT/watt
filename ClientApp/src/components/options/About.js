import React from 'react';

const About = (props) => {
    return (
        <div>
            <h1>About</h1>
            <hr/>
            <p><strong>Gunn WATT</strong> is a Gunn App and UGWA successor that uses a React.js frontend and Firebase backend.</p>
            <p>
                Unlike our competitors, we are open to contribution from everyone.{' '}
                Check out our source code on GitHub <a href="https://github.com/GunnWATT/watt">here</a>!{' '}
                Contribute through a pull request or by opening an issue.
            </p>
        </div>
    );
}

export default About;