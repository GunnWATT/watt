import {useContext, useEffect, useRef} from 'react';
import {useNextPeriod} from '../../hooks/useNextPeriod';
import {parsePeriodColor, parsePeriodName} from './Periods';
import {hexToRgb} from '../../util/progressBarColor';

// Context
import UserDataContext from '../../contexts/UserDataContext';
import CurrentTimeContext from '../../contexts/CurrentTimeContext';


export default function FaviconHandler() {
    const userData = useContext(UserDataContext);

    // TODO: use timeouts
    const date = useContext(CurrentTimeContext);
    const {next, startingIn, endingIn} = useNextPeriod(date);

    // Reference to the favicon element
    const favicon = useRef<HTMLLinkElement>();
    const canvas = useRef<HTMLCanvasElement>();

    const FAVICON_SIZE = 32;
    const borderRadius = FAVICON_SIZE * 0.15;
    const sRadius = FAVICON_SIZE * 0.45; // radius for last seconds

    // Update document name and favicon based on current period
    useEffect(() => {
        const midnight = date.startOf('day');

        // Initialize canvas reference
        if (!canvas.current) {
            canvas.current = document.createElement('canvas');
            canvas.current.width = FAVICON_SIZE;
            canvas.current.height = FAVICON_SIZE;
        }

        // If there's no period to display, set favicon and tab title back to defaults
        if (!next || !startingIn || !endingIn) {
            favicon.current?.remove();
            document.title = 'Web App of The Titans (WATT)';
            return;
        }

        // Initialize favicon <link> element only if there is a non-default favicon to display
        if (!favicon.current) {
            const el = document.createElement('link');
            el.setAttribute('rel', 'icon');
            document.head.appendChild(el);
            favicon.current = el;
        }

        const name = parsePeriodName(next.n, userData);

        document.title = (startingIn > 0)
            ? `${name} starting in ${startingIn} minute${startingIn !== 1 ? 's' : ''}.`
            : `${name} ending in ${endingIn} minute${endingIn !== 1 ? 's' : ''}, started ${-startingIn} minute${startingIn !== -1 ? 's' : ''} ago.`
            + ' (WATT)'

        let numToShow = startingIn > 0 ? startingIn : endingIn;
        const isSeconds = (numToShow === 1);
        let seconds;
        if (isSeconds) {
            seconds = 60 - (date.diff(midnight, 'seconds').seconds % 60);
            numToShow = Math.ceil(seconds);
        }
        // document.title = ['isSeconds: ', isSeconds, ' & numToShow: ', numToShow].join()
        const color = parsePeriodColor(next.n, userData)
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

    return null;
}
