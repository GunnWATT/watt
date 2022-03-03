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
import Dashboard from '../components/classes/Dashboard';

// Images
import noschool1 from '../assets/electron_hw.png';
import noschool2 from '../assets/electron_mitosis.png';
import noschool3 from '../assets/electron_coffee.png';
import noschool4 from '../assets/electron_vsepr.png';
import noschool5 from '../assets/electron_config.png';
import noschool6 from '../assets/electron_phase_change.png';
import noschool7 from '../assets/electron_dipole.png';
import noschool8 from '../assets/electron_gas_laws.png';
import noschool9 from '../assets/electron_activation_energy.png';
import noschool10 from '../assets/electron_box_and_pointer.png';
import noschool11 from '../assets/electron_trumpet.png';
import noschool12 from '../assets/electron_bst.png';
import noschool13 from '../assets/electron_bloch_sphere.png';
import noschool14 from '../assets/electron_cell.png';
import noschool15 from '../assets/electron_hybridization.png';
import noschool16 from '../assets/electron_pedigree.png';
import noschool17 from '../assets/electron_violin.png';


// Big electron image object for carousel
const items = [
    {src: noschool1, caption: 'electronhw', altText: ''},
    {src: noschool2, caption: 'electronmitosis'},
    {src: noschool3, caption: 'electroncoffee'},
    {src: noschool4, caption: 'electronvsepr'},
    {src: noschool5, caption: 'electronconfig'},
    {src: noschool6, caption: 'electronphasechange'},
    {src: noschool7, caption: 'electrondipole'},
    {src: noschool8, caption: 'electrongaslaws'},
    {src: noschool9, caption: 'electronactivationenergy'},
    {src: noschool10, caption: 'electronboxandpointer'},
    {src: noschool11, caption: 'electrontrumpet'},
    {src: noschool12, caption: 'electronbst'},
    {src: noschool13, caption: 'electronblochsphere'},
    {src: noschool14, caption: 'electroncell'},
    {src: noschool15, caption: 'electronhybridization'},
    {src: noschool16, caption: 'electronpedigree'},
    {src: noschool17, caption: 'electronviolin'}
];


export default function Testing() {
    // Color picker background
    const [color, setColor] = useState('#fff');
    const changeColor = (color: ColorResult) => setColor(color.hex);

    // Electron image carousel
    const [activeIndex, setActiveIndex] = useState(0);
    const [animating, setAnimating] = useState(false);

    const next = () => {
        if (animating) return;
        const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
        setActiveIndex(nextIndex);
    }
    const previous = () => {
        if (animating) return;
        const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
        setActiveIndex(nextIndex);
    }
    const goToIndex = (newIndex: number) => {
        if (animating) return;
        setActiveIndex(newIndex);
    }

    const slides = items.map((item) => {
        return (
            <CarouselItem
                onExiting={() => setAnimating(true)}
                onExited={() => setAnimating(false)}
                key={item.src}
            >
                <img src={item.src} alt={item.caption} style={{maxHeight: "400px", maxWidth: "600px"}}/>
                {/* <CarouselCaption captionText={item.caption}/> */}
            </CarouselItem>
        );
    });


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
            <div className="electron-images">
                <Carousel
                    activeIndex={activeIndex}
                    next={next}
                    previous={previous}
                    interval={false}
                >
                    <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={goToIndex} />
                    {slides}
                    <CarouselControl direction="prev" directionText="Previous" onClickHandler={previous} />
                    <CarouselControl direction="next" directionText="Next" onClickHandler={next} />
                </Carousel>
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
