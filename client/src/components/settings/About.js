import React from 'react';
import {Jumbotron} from "reactstrap";

const About = (props) => {
    return (
        <>
            <h1>About</h1>
            {/* <hr/> */}
            <Jumbotron>
                <p className='lead'>
                    If I have seen further, it is by standing on the shoulders of giants.
                </p>
                <p>-Isaac Newton</p>
            </Jumbotron>

            <h2>Installing WATT</h2>
            <p>
                <strong>iOS</strong> — in iOS Safari, tap on the share icon and select
                "Add to Home Screen"
                <br/>
                <strong>Android</strong> — tap on the menu and select "Add to Home
                Screen"
                <br/>
                <strong>Chrome</strong> — click the plus sign in the address bar and
                select "Install"
                <br/>
                <strong>Other browsers</strong> — click the star button in the address
                bar or right click the tab and select "Pin tab"
            </p>

            <h2>Bug Reports</h2>
            <p>
                You can make a new issue on <a href='https://github.com/GunnWATT/watt'>Github</a> to make a feature request or bug report.
                <br/>
                WATT only aims to support the latest versions of Chrome and iOS Safari; others are low-priority.
            </p>

            <h2>About</h2>
            <p>
                The <strong>Web App of The Titans</strong> is a redo of the soon-to-graduate UGWA, complete with Schoology integration and many improvements.
            </p>

            <h2>Credits</h2>
            <p>
                WATT was jointly created by <a href='https://github.com/ytchang05'>Yu-Ting</a> and <a href='https://github.com/ky28059'>Kevin</a>. Special thanks to <a href='https://sheeptester.github.io'>Ovinus Real</a>) for advice and tips along the way.
                <br/>
                Google Search and Stack Overflow helped. Schoology API for integration with Schoology.
                <br/>
                Many of the core features were inspired by UGWA. Also thanks to those that helped in user testing and providing feedback.
            </p>
        </>
    );
}

export default About;