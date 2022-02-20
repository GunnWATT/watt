import {ReactNode} from 'react';
import {Container} from 'reactstrap';
import RedBackground from '../layout/RedBackground';


type HeaderProps = {heading: string, nav: ReactNode, children: ReactNode, other?: ReactNode};
export default function Header(props: HeaderProps) {
    const {heading, nav, children, other} = props;

    return (
        <>
            <RedBackground />
            
            <Container className="header-background">
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
            </Container>
        </>
    );
}
