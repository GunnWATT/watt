import {ReactNode, useContext, useEffect, useState} from 'react';

// Components
import CenteredMessage from '../components/layout/CenteredMessage';
import OutlineButton, {DangerOutlineButton, SuccessOutlineButton} from '../components/layout/OutlineButton';
import Period from '../components/schedule/Period';
import Loading from '../components/layout/Loading';
import WIP from '../components/layout/WIP';
import NoResults from '../components/lists/NoResults';
import SgySignInBtn from '../components/firebase/SgySignInBtn';

// Contexts
import UserDataContext from '../contexts/UserDataContext';
import CurrentTimeContext from '../contexts/CurrentTimeContext';

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
    const currTime = useContext(CurrentTimeContext);

    const [contributors, setContributors] = useState<any[] | null>(null);

    useEffect(() => {
        fetch('https://api.github.com/repos/GunnWATT/watt/contributors')
            .then(res => res.json())
            .then(json => setContributors(json))
    }, [])

    return (
        <div className="container py-6">
            <h1 className="mb-4">Super Secret Testing Facility</h1>

            <p className="mb-4">
                Congratulations! You found the super secret testing area for Gunn WATT!
                Experiments and other potential features will live here until they are accepted or rejected,
                and components that only trigger conditionally (like loading screens for fetched content or period
                components in a specific state) will stay here permanently for convenience in testing.
            </p>

            <p className="mb-6">
                While we're here, I'd like to extend a thank you to all of our GitHub contributors, testers, and advisors,
                who dedicated their time and expertise to work on this project. Your bug fixes and design advice guides
                the continued improvement of WATT as it heads into the future. The following people made WATT possible:
            </p>
            {contributors && (
                <div className="flex flex-wrap justify-center gap-3 px-4 mb-4">
                    {contributors.map((c) => (
                        <Contributor name={c.login} href={c.html_url} src={c.avatar_url} />
                    ))}
                </div>
            )}
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 secondary font-light text-sm px-4 mb-4">
                <span>Brandon Chung</span>
                <span>Sean Yen</span>
                <span>Timothy Herchen</span>
                <span>Saumya Singhal</span>
                <span>Mylie Rodrigo</span>
                <span>Victor Dang</span>
            </div>
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

                <ContentBox>
                    <SgySignInBtn />
                </ContentBox>

                <ContentBox className="flex gap-2 justify-center">
                    <OutlineButton>Add to my list</OutlineButton>
                    <DangerOutlineButton>Disable Schoology</DangerOutlineButton>
                    <SuccessOutlineButton>Looks good!</SuccessOutlineButton>
                </ContentBox>

                <ContentBox>
                    <CenteredMessage>
                        <Loading />
                    </CenteredMessage>
                </ContentBox>

                <ContentBox>
                    <WIP />
                </ContentBox>

                <ContentBox>
                    <NoResults />
                </ContentBox>

                <ContentBox>
                    <div className="mx-auto max-w-3xl">
                        <Period
                            name="1 · Not yet started"
                            color={parsePeriodColor(1, userData)}
                            start={currTime.plus({minute: 20})}
                            end={currTime.plus({minute: 50})}
                            format="h:mm a"
                        />
                        <Period
                            name="2 · Almost finished"
                            color={parsePeriodColor(2, userData)}
                            start={currTime.minus({minute: 20})}
                            end={currTime.plus({minute: 10})}
                            format="h:mm a"
                        />
                        <Period
                            name="3 · Just beginning"
                            color={parsePeriodColor(3, userData)}
                            note="A cantilever is a rigid structural element that extends horizontally and is supported at only one end. Typically it extends from a flat vertical surface such as a wall, to which it must be firmly attached. Like other structural elements, a cantilever can be formed as a beam, plate, truss, or slab."
                            start={currTime.minus({minute: 10})}
                            end={currTime.plus({minute: 20})}
                            format="h:mm a"
                        />
                        <Period
                            name="4 · Halfway there!"
                            color={parsePeriodColor(4, userData)}
                            start={currTime.minus({minute: 15})}
                            end={currTime.plus({minute: 15})}
                            format="h:mm a"
                        />
                        <Period
                            name="5 · Finished"
                            color={parsePeriodColor(5, userData)}
                            start={currTime.minus({minute: 50})}
                            end={currTime.minus({minute: 20})}
                            format="h:mm a"
                        />
                        <Period
                            name="6 · 24-Hour"
                            color={parsePeriodColor(6, userData)}
                            start={currTime.minus({minute: 20})}
                            end={currTime.plus({minute: 10})}
                            format="H:mm"
                        />
                        <Period
                            name="7 · With Zoom Link"
                            color={parsePeriodColor(7, userData)}
                            start={currTime.minus({minute: 50})}
                            end={currTime.plus({minute: 15})}
                            format="h:mm a"
                            zoom="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                        />
                    </div>
                </ContentBox>
            </main>
        </div>
    )
}

function ContentBox(props: {children: ReactNode, className?: string}) {
    return (
        <section className={'p-5 rounded-lg bg-content dark:bg-content-dark shadow-lg' + (props.className ? ` ${props.className}` : '')}>
            {props.children}
        </section>
    )
}

type ContributorProps = {name: string, href: string, src: string};
function Contributor(props: ContributorProps) {
    return (
        <a href={props.href} target="_blank" rel="noopener noreferrer" className="rounded-full overflow-clip hover:ring-4 hover:ring-tertiary dark:hover:ring-tertiary-dark transition duration-100">
            <img src={props.src} alt={props.name} className="h-12 w-12" />
        </a>
    )
}
