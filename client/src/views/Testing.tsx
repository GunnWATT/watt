import React, { useState } from 'react';
import moment from 'moment';
import { SketchPicker, ChromePicker, BlockPicker } from 'react-color';
import { Row } from 'reactstrap';

// Components
import Period from '../components/schedule/Period';
import Loading from '../components/misc/Loading';
import WIP from '../components/misc/WIP';
import NoResults from '../components/lists/NoResults';
import SgySignInBtn from '../components/auth/SgySignInBtn';


const Testing = () => {
    const [color, setColor] = useState('#fff');
    const changeColor = (color) => setColor(color.hex);

    return (
        <div className="testing">
            <h1>Super Secret Testing Facility</h1>
            <p>
                Congratulations! You found the super secret testing area for Gunn WATT!{' '}
                Experiments and other potential features will live here until they are accepted or rejected,{' '}
                and components that only trigger conditionally (like loading screens for fetched content or period components in a specific state){' '}
                will stay here permanently for convenience in testing!
            </p>
            <hr/>

            <div className="auth-test">
                <SgySignInBtn/>
            </div>
            <div className="colorpicker-test">
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
                <Loading/>
            </div>
            <div className="work-test fixed-height">
                <WIP/>
            </div>
            <div className="query-test fixed-height">
                <NoResults/>
            </div>
            <div className="periods-test">
                <Period
                    name='Not Yet Started'
                    color='#f4aeafff'
                    now={moment()}
                    start={moment().add(20, 'minutes')}
                    end={moment().add(50, 'minutes')}
                />
                <Period
                    name='In Progress Blue'
                    color='#aedef4ff'
                    now={moment()}
                    start={moment().subtract(20, 'minutes')}
                    end={moment().add(10, 'minutes')}
                />
                <Period
                    name='In Progress Orange'
                    color='#f4dcaeff'
                    now={moment()}
                    start={moment().subtract(10, 'minutes')}
                    end={moment().add(20, 'minutes')}
                />
                <Period
                    name='In Progress Green'
                    color='#aef4dcff'
                    now={moment()}
                    start={moment().subtract(15, 'minutes')}
                    end={moment().add(15, 'minutes')}
                />
                <Period
                    name='Finished'
                    color='#f4f3aeff'
                    now={moment()}
                    start={moment().subtract(50, 'minutes')}
                    end={moment().subtract(20, 'minutes')}
                />
            </div>
        </div>
    )
}

export default Testing;
