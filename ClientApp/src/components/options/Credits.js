import React from 'react';
import { Jumbotron } from 'reactstrap';

const Credits = (props) => {
    return (
        <div>
            <h1>Credits</h1>
            <Jumbotron>
                <p className="lead">If I have seen further, it is by standing on the shoulders of giants.</p>
                <p>-Isaac Newton</p>
            </Jumbotron>
            <p>
                This app would not have been possible without its predecessor, <a href="https://github.com/Orbiit/gunn-web-app">UGWA</a>.{' '}
                A large thank you to <a href="https://github.com/SheepTester">Sean</a>, for not just UGWA but also for the Schoology integration WATT relies on.
            </p>
            <p>
                WATT was jointly created by <a href="https://github.com/ky28059">Kevin</a>, who made the React frontend,{' '}
                and <a href="https://github.com/ytchang05">Yu-Ting</a>, who made the Firebase backend.
            </p>
        </div>
    );
}

export default Credits;