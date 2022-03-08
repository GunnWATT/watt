import {useContext, useState} from 'react';
import moment from 'moment';

// Components
import Period from '../components/schedule/Period';
import Loading from '../components/layout/Loading';
import WIP from '../components/layout/WIP';
import NoResults from '../components/lists/NoResults';
import SgySignInBtn from '../components/firebase/SgySignInBtn';

// Contexts
import UserDataContext from '../contexts/UserDataContext';

// Utilities
import {parsePeriodColor} from '../components/schedule/Periods';

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
    const userData = useContext(UserDataContext);

    return (
        <div className="testing py-6 container">
            <h1>Super Secret Testing Facility</h1>
            <p>
                Congratulations! You found the super secret testing area for Gunn WATT!{' '}
                Experiments and other potential features will live here until they are accepted or rejected,{' '}
                and components that only trigger conditionally (like loading screens for fetched content or period components in a specific state){' '}
                will stay here permanently for convenience in testing.
            </p>
            <hr/>

            <main className="flex flex-col gap-4">
                {/* TODO: implement this but better */}
                {/*
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
                */}

                <section className="auth-test">
                    <SgySignInBtn/>
                </section>

                <section className="loading-test">
                    <Loading/>
                </section>

                <section className="work-test">
                    <WIP/>
                </section>

                <section className="query-test">
                    <NoResults/>
                </section>

                <section className="periods-test">
                    <div className="mx-auto max-w-3xl">
                        <Period
                            name="1 · Not yet started"
                            color={parsePeriodColor(1, userData)}
                            now={moment()}
                            start={moment().add(20, 'minutes')}
                            end={moment().add(50, 'minutes')}
                            format='h:mm A'
                        />
                        <Period
                            name="2 · Almost finished"
                            color={parsePeriodColor(2, userData)}
                            now={moment()}
                            start={moment().subtract(20, 'minutes')}
                            end={moment().add(10, 'minutes')}
                            format='h:mm A'
                        />
                        <Period
                            name="3 · Just beginning"
                            color={parsePeriodColor(3, userData)}
                            now={moment()}
                            start={moment().subtract(10, 'minutes')}
                            end={moment().add(20, 'minutes')}
                            format='h:mm A'
                        />
                        <Period
                            name="4 · Halfway there!"
                            color={parsePeriodColor(4, userData)}
                            now={moment()}
                            start={moment().subtract(15, 'minutes')}
                            end={moment().add(15, 'minutes')}
                            format='h:mm A'
                        />
                        <Period
                            name="5 · Finished"
                            color={parsePeriodColor(5, userData)}
                            now={moment()}
                            start={moment().subtract(50, 'minutes')}
                            end={moment().subtract(20, 'minutes')}
                            format="h:mm A"
                        />
                        <Period
                            name="6 · 24-Hour"
                            color={parsePeriodColor(6, userData)}
                            now={moment()}
                            start={moment().subtract(20, 'minutes')}
                            end={moment().add(10, 'minutes')}
                            format="H:mm"
                        />
                        <Period
                            name="7 · With Zoom Link"
                            color={parsePeriodColor(7, userData)}
                            now={moment()}
                            start={moment().subtract(50, 'minutes')}
                            end={moment().subtract(20, 'minutes')}
                            format='H:mm'
                            zoom="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                        />
                    </div>
                </section>
            </main>
        </div>
    )
}
