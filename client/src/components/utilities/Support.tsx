import React from 'react';
import {Container, CardGroup, Card, CardBody, CardTitle, CardSubtitle, CardText} from 'reactstrap';


const Support = () => {
    return (
        <Container>
            <h1>Student resources</h1>
            <p className="secondary">Sponsored by the ROCK team.</p>
            <CardGroup>
                <Card>
                    <CardBody>
                        <CardTitle>Crisis Text Line</CardTitle>
                        <CardSubtitle><a href="sms:741-741">741-741</a></CardSubtitle>
                        <CardText>For everyone in crisis; text "Help", Text "LGBTQ" for LGBTQQ-specific
                            support</CardText>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <CardTitle>Suicide Prevention Hotline</CardTitle>
                        <CardSubtitle><a href="tel:800-273-8256">800-273-8256</a></CardSubtitle>
                        <CardText>Prevention and crisis resources (national)</CardText>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <CardTitle>Suicide & Crisis Line</CardTitle>
                        <CardSubtitle><a href="tel:855-278-4204">855-278-4204</a></CardSubtitle>
                        <CardText>For individuals in crisis (Santa Clara County)</CardText>
                    </CardBody>
                </Card>
            </CardGroup>
            <CardGroup>
                <Card>
                    <CardBody>
                        <CardTitle>Star Vista</CardTitle>
                        <CardSubtitle><a href="tel:650-579-0350">650-579-0350</a></CardSubtitle>
                        <CardText>Crisis intervention (San Mateo County)</CardText>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <CardTitle>Uplift</CardTitle>
                        <CardSubtitle><a href="tel:408-379-9085">408-379-9085</a></CardSubtitle>
                        <CardText>Mobile crisis intervention and safety planning</CardText>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <CardTitle>Trevor Lifeline</CardTitle>
                        <CardSubtitle><a href="tel:866-488-7386">866-488-7386</a></CardSubtitle>
                        <CardText>LGBTQ crisis intervention and suicide prevention</CardText>
                    </CardBody>
                </Card>
            </CardGroup>
        </Container>
    );
}

export default Support;