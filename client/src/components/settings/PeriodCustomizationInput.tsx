import { useContext, useEffect, useRef, useState } from 'react';
import {Popover} from '@headlessui/react';
import {useAuth, useFirestore} from 'reactfire';
import { ColorResult, SketchPicker } from 'react-color';

// Components
import AnimatedPopover from '../layout/AnimatedPopover';

// Contexts
import UserDataContext, {SgyPeriodData} from '../../contexts/UserDataContext';

// Utilities
import {updateUserData} from '../../util/firestore';
import {darkPerColors, parsePeriodColor, periodColors} from '../schedule/Periods';
import {periodNameDefault} from '@watt/shared/util/schedule';


type PeriodCustomizationInputProps = {id: string, data: SgyPeriodData};
export default function PeriodCustomizationInput(props: PeriodCustomizationInputProps) {
    const {id, data: {n, c, l, o, s, r}} = props;
    const defaultName = periodNameDefault(id);

    // Function to update this period's fields on firestore
    const auth = useAuth();
    const firestore = useFirestore();

    const updatePeriodData = async (newValue: string, field: string) =>
        await updateUserData(`classes.${id}.${field}`, newValue, auth, firestore);

    const userData = useContext(UserDataContext);
    const [color, setColor] = useState(parsePeriodColor(id, userData));
    const changeColor = (color: ColorResult) => setColor(color.hex);

    const [name, setName] = useState(n || defaultName);
    const [room, setRoom] = useState(r);

    const isUpperPeriod = ['0', '1', '2', '3'].includes(id);

    // Update default colors on cross-device theme change.
    // TODO: a bit unideal, but there doesn't seem to be another way to do this.
    useEffect(() => {
        setColor(parsePeriodColor(id, userData));
    }, [userData.options.theme])

    return (
        <div className="relative rounded-md shadow-lg p-5" style={{backgroundColor: color}}>
            <div className="flex flex-wrap gap-2 items-center mb-2">
                <h2 className="text-xl break-words min-w-0">{name}</h2>
                <span className="flex gap-1">
                    {room && (
                        <span className="rounded-full px-2 py-1 text-xs h-max bg-black/10 dark:bg-black/20">
                            {room}
                        </span>
                    )}
                </span>
            </div>

            <Popover className="absolute right-6 top-2 h-10">
                <Popover.Button
                    className="w-10 h-10 mt-3.5 rounded border-2 border-tertiary"
                    style={{backgroundColor: color}}
                />
                <AnimatedPopover className={`absolute right-0 z-10 touch-none ${isUpperPeriod ? 'top-[calc(100%_+_10px)]' : 'bottom-[calc(100%_+_10px)]'}`}>
                    {/* TODO: we should consider making our own custom picker for this */}
                    {/* or maybe styling a browser default input; these pickers come with their own component styles */}
                    {/* and, like reactstrap, don't give enough creative freedom to add, say, a "reset to defaults" button */}
                    <SketchPicker
                        className="period-customization-picker"
                        color={color}
                        onChange={changeColor}
                        onChangeComplete={(color: ColorResult) => updatePeriodData(color.hex, 'c')}
                        presetColors={userData.options.theme === 'light' ? periodColors : darkPerColors}
                        disableAlpha
                    />
                </AnimatedPopover>
            </Popover>

            <div className="flex gap-6">
                <div className="flex-grow flex flex-wrap gap-4">
                    <div className="flex-grow flex flex-col gap-2">
                        <label htmlFor={`${id} name`} className="text-secondary text-sm">{defaultName}</label>
                        <input
                            type="text"
                            name={`${id} name`}
                            id={`${id} name`}
                            className="rounded px-3 py-1.5 bg-black/30 placeholder:text-secondary placeholder:font-light border border-tertiary focus:outline-none focus-visible:ring-[3px] focus-visible:ring-[0xFF7DADD9]"
                            placeholder={defaultName}
                            defaultValue={n}
                            onChange={e => setName(e.target.value || defaultName)}
                            onBlur={e => updatePeriodData(e.target.value, 'n')}
                        />
                    </div>

                    <div className="flex-grow flex flex-col gap-2">
                        <label htmlFor={`${id} room`} className="text-secondary text-sm">{defaultName} Room</label>
                        <input
                            type="text"
                            name={`${id} room`}
                            id={`${id} room`}
                            className="rounded px-3 py-1.5 bg-black/30 placeholder:text-secondary placeholder:font-light border border-tertiary focus:outline-none focus-visible:ring-[3px] focus-visible:ring-[0xFF7DADD9]"
                            placeholder={`${defaultName} Room`}
                            defaultValue={r}
                            onChange={e => setRoom(e.target.value)}
                            onBlur={e => updatePeriodData(e.target.value, 'r')}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
