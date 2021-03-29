import React from 'react';
import {Container} from 'reactstrap';


type HeaderProps = {heading: string, nav: React.ReactNode, children: React.ReactNode, other?: React.ReactNode};
const Header = (props: HeaderProps) => {
    const {heading, nav, children, other} = props;

    return (
        <>
            <div id="red-bg" />
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
        </>
    );
}

export default Header;
