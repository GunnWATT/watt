import {Col, FormGroup, Input, Label, Row} from 'reactstrap';

import UserDataContext, {SgyPeriodData} from '../../contexts/UserDataContext';
import {darkPerColors, parsePeriodColor, periodColors, periodNameDefault} from '../schedule/Periods';

// Firestore
import {useAuth, useFirestore} from 'reactfire';
import {updateUserData} from '../../firebase/updateUserData'
import { ColorResult, SketchPicker } from 'react-color';
import { useContext, useEffect, useRef, useState } from 'react';


type PeriodProps = {id: string, data: SgyPeriodData};
export default function PeriodCustomizationInput(props: PeriodProps) {
    const {id, data: {n, c, l, o, s}} = props;
    const name = periodNameDefault(id);

    // Function to update this period's fields on firestore
    const auth = useAuth();
    const firestore = useFirestore();

    const updatePeriodData = async (newValue: string, field: string) =>
        await updateUserData(`classes.${id}.${field}`, newValue, auth, firestore);

    // const [color,setColor] = useState('#fff');
    const userData = useContext(UserDataContext);
    const [color, setColor] = useState(parsePeriodColor(id, userData));
    const changeColor = (color: ColorResult) => setColor(color.hex);

    const [colorPicker, setColorPicker] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // closing the calendar on click outside
    // https://stackoverflow.com/questions/32553158/detect-click-outside-react-component
    useEffect(() => {
        let handleClickOutside = (event: MouseEvent) => {
            if (ref.current && event.target instanceof Node && !(ref.current.contains(event.target))) {
                setColorPicker(false);
            }
        }

        // Bind the event listener
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref]);

    const upperPeriods = ['0', '1', '2', '3'];
    const isUpperPeriod = upperPeriods.includes(id);

    return (
        <div className="periods-custom-row-burrito">
            <div className="periods-custom-picker-burrito" ref={ref}>
                <div
                    className='periods-custom-picker-square'
                    style={{backgroundColor: color}}
                    onClick={() => setColorPicker(!colorPicker)}
                />
                <div className={`periods-custom-picker-div-${isUpperPeriod ? 'top' : 'bottom'}`} hidden={!colorPicker}>
                    <SketchPicker
                        color={color}
                        onChange={changeColor}
                        onChangeComplete={(color: ColorResult) => updatePeriodData(color.hex, 'c')}
                        presetColors={userData.options.theme === 'light' ? periodColors : darkPerColors}
                        disableAlpha
                    />
                </div>
            </div>

            <div className="periods-custom-inputs">
                <FormGroup>
                    <Label for="class-name">{name}</Label>
                    <Input
                        type="text" name="name" id="class-name"
                        placeholder={name}
                        defaultValue={n}
                        onBlur={e => updatePeriodData(e.target.value, 'n')}
                    />
                </FormGroup>

                <FormGroup>
                    <Label for="link">{name} Link</Label>
                    <Input
                        type="text" name="link" id="link"
                        placeholder={`${name} Link`}
                        defaultValue={l}
                        onBlur={e => updatePeriodData(e.target.value, 'l')}
                    />
                </FormGroup>
            </div>
        </div>
    );
}
