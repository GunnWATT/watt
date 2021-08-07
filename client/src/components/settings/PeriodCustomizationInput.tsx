import React from 'react';
import {Col, FormGroup, Input, Label, Row} from 'reactstrap';

import {SgyPeriodData} from '../../contexts/UserDataContext';
import { updateUserData } from '../../firebase/updateUserData'
import {periodNameDefault} from '../schedule/Periods';


type PeriodProps = {id: string, data: SgyPeriodData};
const PeriodCustomizationInput = (props: PeriodProps) => {
    const {id, data} = props;
    const {n, c, l, o, s} = data;

    const name = periodNameDefault(id)

    // Function to update this period's fields on firestore
    const updatePeriodData = async (newValue: string, field: string) => {
        await updateUserData(`classes.${id}.${field}`, newValue);
    }

    return (
        <Row form>
            <Col md={6}>
                <FormGroup>
                    <Label for="class-name">{name}</Label>
                    <Input
                        type="text" name="name" id="class-name"
                        placeholder={name}
                        defaultValue={n}
                        onBlur={e => updatePeriodData(e.target.value, 'n')}
                    />
                </FormGroup>
            </Col>
            <Col md={6}>
                <FormGroup>
                    <Label for="zoom-link">{name} Zoom Link</Label>
                    <Input
                        type="text" name="zoom" id="zoom-link"
                        placeholder={`${name} Zoom Link`}
                        defaultValue={l}
                        onBlur={e => updatePeriodData(e.target.value, 'l')}
                    />
                </FormGroup>
            </Col>
        </Row>
    );
}

export default PeriodCustomizationInput;