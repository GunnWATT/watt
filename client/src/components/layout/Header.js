import React from "react";
import {Container} from 'reactstrap';

const Header = (props) => {
    const {heading, nav, children, other} = props;

    return (
        <div className="header-background">
            <Container className="header">
                <span className="heading">
                    <h1>{heading}</h1>
                    {other}
                </span>
            </Container>
            <Container className="page-nav">
                {nav}
            </Container>
            <Container className="page">
                {children}
            </Container>
        </div>
    );
}

export default Header;
