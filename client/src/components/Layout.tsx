import {useContext, useEffect, useState, ReactNode, useRef} from 'react';
import {useLocation, useHistory} from 'react-router-dom';
import {Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import {useScreenType} from '../hooks/useScreenType';

// Components
import Sidebar from './layout/Sidebar';
import BottomNav from './layout/BottomNav';

// Context
import UserDataContext from '../contexts/UserDataContext';
import CurrentTimeContext from '../contexts/CurrentTimeContext';

// Schoology Auth
import SgyInitResults from './firebase/SgyInitResults';

// Utils
import {parseNextPeriod} from './schedule/PeriodIndicator';
import {parsePeriodName, parsePeriodColor} from './schedule/Periods';
import {hexToRgb} from './schedule/ProgressBarColor';


type LayoutProps = {children: ReactNode};
const Layout = (props: LayoutProps) => {
    // Screen type for responsive layout
    const screenType = useScreenType();

    // Search params handling
    const { search, pathname } = useLocation();
    const { replace } = useHistory();
    const searchParams = new URLSearchParams(search);

    // Modals
    // Consider extracting this elsewhere
    const [sgyModal, setSgyModal] = useState(searchParams.get('modal') === 'sgyauth');
    const toggle = () => {
        setSgyModal(false);
        searchParams.delete('modal'); // Delete modal param from url to prevent retrigger on page refresh
        replace(`${pathname}${searchParams}`); // Replace current instance in history stack with updated search params
    }

    // Render layout dynamically
    let content;
    if (screenType === 'phone') { // On phone screens, use bottom nav instead of sidebar
        content = (
            <div id="app" className="vertical">
                <div id="content">
                    {props.children}
                </div>
                <BottomNav/>
            </div>
        );
    } else if (screenType === 'smallScreen') { // On small screens, collapse the sidebar by default
        content = (
            <div id="app">
                <Sidebar forceCollapsed/>
                <div id="content">
                    {props.children}
                </div>
            </div>
        );
    } else { // Otherwise, display layout normally
        content = (
            <div id="app">
                <Sidebar/>
                <div id="content">
                    {props.children}
                </div>
            </div>
        );
    }

    // Change theme on userData change
    const userData = useContext(UserDataContext);
    useEffect(() => {
        document.body.className = userData.options.theme;
    }, [userData.options.theme])

    // Favicon
    // TODO: use timeouts and move this out of Layout
    const date = useContext(CurrentTimeContext);

    // Reference to the favicon element
    const favicon = useRef<HTMLLinkElement>();
    const canvas = useRef<HTMLCanvasElement>();

    const FAVICON_SIZE = 32
    const borderRadius = FAVICON_SIZE * 0.15
    const sRadius = FAVICON_SIZE * 0.45 // radius for last seconds

    // Update document name and favicon based on current period
    useEffect(() => {
        const midnight = date.clone().startOf('date');
        const minutes = date.diff(midnight, 'minutes');
        const period = parseNextPeriod(date, minutes, userData);

        // Initialize favicon link and canvas references
        if (!favicon.current) {
            const el = document.createElement('link');
            el.setAttribute('rel', 'icon');
            document.head.appendChild(el);
            favicon.current = el;
        }
        if (!canvas.current) {
            canvas.current = document.createElement('canvas');
            canvas.current.width = FAVICON_SIZE;
            canvas.current.height = FAVICON_SIZE;
        }

        // If there's no period to display, set favicon and tab title back to defaults
        if (!period) {
            favicon.current.href = '/icons/watt.png';
            document.title = 'Web App of The Titans (WATT)';
            return;
        }
        const {next} = period;

        const name = parsePeriodName(next[0], userData);
        const startingIn = next[1].s - minutes;
        const endingIn = next[1].e - minutes;

        document.title = (startingIn > 0)
            ? `${name} starting in ${startingIn} minute${startingIn !== 1 ? 's' : ''}.`
            : `${name} ending in ${endingIn} minute${endingIn !== 1 ? 's' : ''}, started ${-startingIn} minute${startingIn !== -1 ? 's' : ''} ago.`
            + ' (WATT)'

        let numToShow = startingIn > 0 ? startingIn : endingIn;
        const isSeconds = (numToShow === 1);
        let seconds;
        if (isSeconds) {
            seconds = 60 - (date.diff(midnight, 'seconds') % 60);
            numToShow = seconds;
        }
        // document.title = ['isSeconds: ', isSeconds, ' & numToShow: ', numToShow].join()
        const color = parsePeriodColor(next[0], userData)
        const fc = canvas.current.getContext('2d')!

        // configure it to look nice
        fc.textAlign = 'center'
        fc.textBaseline = 'middle'
        fc.lineWidth = FAVICON_SIZE * 0.1
        fc.lineJoin = 'round'
        fc.lineCap = 'round'

        function isLight(colour: string) {
            const colorArr = hexToRgb(colour)!;
            // https://stackoverflow.com/questions/11867545/change-text-color-based-on-brightness-of-the-covered-background-area
            return (
                Math.round(
                    (parseInt('' + colorArr[0]) * 299 +
                        parseInt('' + colorArr[1]) * 587 +
                        parseInt('' + colorArr[2]) * 114) /
                    1000
                ) > 150
            )
        }

        fc.clearRect(0, 0, FAVICON_SIZE, FAVICON_SIZE)

        if (isSeconds) {
            fc.fillStyle = color;
            fc.strokeStyle = color;
            fc.beginPath();
            fc.moveTo(FAVICON_SIZE / 2 + sRadius, FAVICON_SIZE / 2)
            fc.arc(FAVICON_SIZE / 2, FAVICON_SIZE / 2, sRadius, 0, 2 * Math.PI)
            fc.closePath()
            fc.fill()

            fc.beginPath()
            fc.moveTo(FAVICON_SIZE / 2, FAVICON_SIZE / 2 - sRadius)
            // Rounding seconds so when it shows 30 seconds always will show half-way,
            // even if it's not exactly 30s
            fc.arc(
                FAVICON_SIZE / 2,
                FAVICON_SIZE / 2,
                sRadius,
                Math.PI * 1.5,
                2 * Math.PI * (1 - Math.round(numToShow) / 60) - Math.PI / 2,
                true
            )
            fc.stroke()

            fc.fillStyle = isLight(color) ? 'black' : 'white';
            fc.font = `bold ${FAVICON_SIZE * 0.6}px "Roboto", sans-serif`
            fc.fillText(
                Math.round(numToShow)
                    .toString()
                    .padStart(2, '0'),
                FAVICON_SIZE / 2,
                FAVICON_SIZE * 0.575
            )
        } else {
            /*let percent: number;

            if (startingIn > 0) {
                percent = 1 - (startingIn / 10)
            } else {
                percent = numToShow / (endingIn - startingIn);
            }*/

            fc.fillStyle = color || 'info'
            fc.beginPath()
            // Rounded square
            fc.moveTo(0, borderRadius)
            fc.arc(borderRadius, borderRadius, borderRadius, Math.PI, Math.PI * 1.5)
            fc.lineTo(FAVICON_SIZE - borderRadius, 0)
            fc.arc(
                FAVICON_SIZE - borderRadius,
                borderRadius,
                borderRadius,
                -Math.PI / 2,
                0
            )
            fc.lineTo(FAVICON_SIZE, FAVICON_SIZE - borderRadius)
            fc.arc(
                FAVICON_SIZE - borderRadius,
                FAVICON_SIZE - borderRadius,
                borderRadius,
                0,
                Math.PI / 2
            )
            fc.lineTo(borderRadius, FAVICON_SIZE)
            fc.arc(
                borderRadius,
                FAVICON_SIZE - borderRadius,
                borderRadius,
                Math.PI / 2,
                Math.PI
            )
            fc.closePath()
            fc.fill()

            fc.fillStyle = isLight(color)? 'black' : 'white';
            fc.font = `bold ${FAVICON_SIZE * 0.8}px "Roboto", sans-serif`
            fc.fillText(''+numToShow, FAVICON_SIZE / 2, FAVICON_SIZE * 0.575)
        }

        favicon.current.href = canvas.current.toDataURL();

    }, [date])

    return (
        <>
            {content}

            {/* Schoology auth success modal */}
            <Modal isOpen={sgyModal} toggle={toggle}>
                <ModalHeader toggle={toggle}>You're almost set! Just one last step remaining.</ModalHeader>
                <ModalBody>
                    <SgyInitResults />
                </ModalBody>
                <ModalFooter>

                </ModalFooter>
            </Modal>
        </>
    );
}

export default Layout;