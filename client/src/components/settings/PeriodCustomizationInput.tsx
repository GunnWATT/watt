import {Col, FormGroup, Input, Label, Row} from 'reactstrap';

import {SgyPeriodData} from '../../contexts/UserDataContext';
import {periodNameDefault} from '../schedule/Periods';

// Firestore
import {useAuth, useFirestore} from 'reactfire';
import {updateUserData} from '../../firebase/updateUserData'


type PeriodProps = {id: string, data: SgyPeriodData};
export default function PeriodCustomizationInput(props: PeriodProps) {
    const {id, data: {n, c, l, o, s}} = props;
    const name = periodNameDefault(id);

    // Function to update this period's fields on firestore
    const auth = useAuth();
    const firestore = useFirestore();

    const updatePeriodData = async (newValue: string, field: string) =>
        await updateUserData(`classes.${id}.${field}`, newValue, auth, firestore);

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
                    <Label for="link">{name} Link</Label>
                    <Input
                        type="text" name="link" id="link"
                        placeholder={`${name} Link`}
                        defaultValue={l}
                        onBlur={e => updatePeriodData(e.target.value, 'l')}
                    />
                </FormGroup>
            </Col>
        </Row>
    );
}
