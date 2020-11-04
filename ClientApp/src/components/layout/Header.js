import React from "react";
import {Container} from 'reactstrap';

const Header = (props) => {
    return (
        <div className="header-background">
            <Container className="header">
                <span className="heading">
                    <h1>{props.heading}</h1>
                    {props.other}
                </span>
            </Container>
            <Container className="nav">
                {props.nav}
            </Container>
            <Container className="page">
                {props.children}
            </Container>
        </div>
    );
}

export default Header;
