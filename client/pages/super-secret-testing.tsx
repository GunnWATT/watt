import { useState } from 'react';
import moment from 'moment';
import { ColorResult, SketchPicker, ChromePicker, BlockPicker } from 'react-color';
import { Row, Carousel, CarouselControl, CarouselIndicators, CarouselItem, CarouselCaption } from 'reactstrap';

// Components
import Period from '../components/schedule/Period';
import Loading from '../components/layout/Loading';
import WIP from '../components/layout/WIP';
import NoResults from '../components/lists/NoResults';
import SgySignInBtn from '../components/firebase/SgySignInBtn';


export default function Testing() {
    // Color picker background
    const [color, setColor] = useState('#fff');
    const changeColor = (color: ColorResult) => setColor(color.hex);

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
            <div className="loading-test">
                <Loading/>
            </div>
            <div className="work-test">
                <WIP/>
            </div>
            <div className="query-test">
                <NoResults/>
            </div>
            <div className="periods-test">
                <div className="schedule-wrapper">
                    <Period
                        name='Not Yet Started'
                        color='#f4aeafff'
                        now={moment()}
                        start={moment().add(20, 'minutes')}
                        end={moment().add(50, 'minutes')}
                        format='h:mm A'
                    />
                    <Period
                        name='In Progress Blue'
                        color='#aedef4ff'
                        now={moment()}
                        start={moment().subtract(20, 'minutes')}
                        end={moment().add(10, 'minutes')}
                        format='h:mm A'
                    />
                    <Period
                        name='In Progress Orange'
                        color='#f4dcaeff'
                        now={moment()}
                        start={moment().subtract(10, 'minutes')}
                        end={moment().add(20, 'minutes')}
                        format='h:mm A'
                    />
                    <Period
                        name='In Progress Green'
                        color='#aef4dcff'
                        now={moment()}
                        start={moment().subtract(15, 'minutes')}
                        end={moment().add(15, 'minutes')}
                        format='h:mm A'
                    />
                    <Period
                        name='Finished'
                        color='#f4f3aeff'
                        now={moment()}
                        start={moment().subtract(50, 'minutes')}
                        end={moment().subtract(20, 'minutes')}
                        format='h:mm A'
                    />
                    <Period
                        name='24-Hour'
                        color='#aff4aeff'
                        now={moment()}
                        start={moment().subtract(20, 'minutes')}
                        end={moment().add(10, 'minutes')}
                        format='H:mm'
                    />
                    <Period
                        name='With Zoom Link'
                        color='#aeaff4ff'
                        now={moment()}
                        start={moment().subtract(50, 'minutes')}
                        end={moment().subtract(20, 'minutes')}
                        format='H:mm'
                        zoom="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    />
                </div>
            </div>
        </div>
    )
}
