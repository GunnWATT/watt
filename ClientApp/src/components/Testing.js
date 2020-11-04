import React, { useState } from 'react';
import { SketchPicker, ChromePicker, BlockPicker } from 'react-color';
import { Row } from 'reactstrap';

import Loading from './misc/Loading';


const Testing = (props) => {
    const [color, setColor] = useState('#fff');
    const changeColor = (color) => setColor(color.hex);

    return (
        <div className="testing">
            <h1>Super Secret Testing Facility</h1>
            <p>Congratulations! You found the super secret testing area for Gunn WATT! Experiments and other potential features will live here until they are accepted or rejected.</p>
            <div className="colorpicker-test">
                <h2>Colorpicker Test</h2>
                <div style={{'background-color': color}}>
                    <Row>
                        <SketchPicker
                            color={ color }
                            onChange={ changeColor }
                        />
                        <ChromePicker
                            color={ color }
                            onChange={ changeColor }
                        />
                        <BlockPicker
                            color={ color }
                            onChange={ changeColor }
                        />
                    </Row>
                </div>
            </div>
            <div className="loading-test">
                <h2>Loading Screen</h2>
                <div>
                    <Loading/>
                </div>
            </div>
        </div>
    )
}

export default Testing;