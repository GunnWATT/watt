import React, { useState } from 'react';
import moment from 'moment';
import { SketchPicker, ChromePicker, BlockPicker } from 'react-color';
import { Row } from 'reactstrap';

import Period from './schedule/Period';
import Loading from './misc/Loading';
import WIP from './misc/WIP';
import NoResults from "./lists/NoResults";


const Testing = (props) => {
    const [color, setColor] = useState('#fff');
    const changeColor = (color) => setColor(color.hex);

    return (
        <div className="testing">
            <h1>Super Secret Testing Facility</h1>
            <p>Congratulations! You found the super secret testing area for Gunn WATT! Experiments and other potential features will live here until they are accepted or rejected.</p>
            <div className="colorpicker-test">
                <h2>Colorpicker Test</h2>
                <div style={{backgroundColor: color}}>
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
            <div className="loading-test fixed-height">
                <h2>Loading Screen</h2>
                <Loading/>
            </div>
            <div className="work-test fixed-height">
                <h2>Work in Progress</h2>
                <WIP/>
            </div>
            <div className="query-test fixed-height">
                <h2>No Results Found</h2>
                <NoResults/>
            </div>
            <div className="periods-test">
                <h2>Period yet to start</h2>
                <Period
                    name='Testing'
                    now={moment()}
                    start={moment().add(20, 'minutes')}
                    end={moment().add(50, 'minutes')}
                />
                <h2>Partially finished period</h2>
                <Period
                    name='Testing'
                    now={moment()}
                    start={moment().subtract(20, 'minutes')}
                    end={moment().add(10, 'minutes')}
                />
                <h2>Finished period</h2>
                <Period
                    name='Testing'
                    now={moment()}
                    start={moment().subtract(50, 'minutes')}
                    end={moment().subtract(20, 'minutes')}
                />
            </div>
        </div>
    )
}

export default Testing;