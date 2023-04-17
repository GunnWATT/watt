import {useContext, useEffect, useRef} from 'react';
import type {WebviewWindow} from '@tauri-apps/api/window';

// Utils
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
    const {next, startingIn, endingIn, nextSeconds} = useNextPeriod(date);

    // Reference to the favicon element
    const favicon = useRef<HTMLLinkElement>();
    const canvas = useRef<HTMLCanvasElement>();

    const FAVICON_SIZE = 32;
    const borderRadius = FAVICON_SIZE * 0.15;
    const sRadius = FAVICON_SIZE * 0.45; // radius for last seconds

    // TODO: conceptually, this logic only runs if a certain environment is present at build time;
    // unsure how to implement that though
    const appWindowRef = useRef<WebviewWindow | null>(null);
    const iconByteDataRef = useRef<Uint8Array | null>(null);
    useEffect(() => {
        if (!window.__TAURI_METADATA__) return;

        // Dynamically import tauri window api only if running in desktop mode
        import('@tauri-apps/api/window').then(({appWindow}) => {
            appWindowRef.current = appWindow;
        });

        // TODO: rather hacky, would much prefer if this could be done at build-time
        fetch('/icons/512x512.png').then((res) => res.arrayBuffer())
            .then(buf => iconByteDataRef.current = new Uint8Array(buf));
    }, [])

    function setTitle(title: string) {
        document.title = title;
        appWindowRef.current?.setTitle(title).catch(e => console.error(e));
    }

    // Update document name and favicon based on current period
    useEffect(() => {
        // Initialize canvas reference
        if (!canvas.current) {
            canvas.current = document.createElement('canvas');
            canvas.current.width = FAVICON_SIZE;
            canvas.current.height = FAVICON_SIZE;
        }

        // If there's no period to display, set favicon and tab title back to defaults
        if (!next) {
            if (favicon.current) favicon.current.href = '/icons/favicon.ico';
            setTitle('Web App of The Titans (WATT)');
            if (iconByteDataRef.current) void appWindowRef.current?.setIcon(iconByteDataRef.current)
            return;
        }

        // Initialize favicon <link> element only if there is a non-default favicon to display
        if (!favicon.current) {
            favicon.current = document.querySelector('link[sizes="16x16 24x24 32x32 48x48 64x64 256x256"]')! as HTMLLinkElement;
        }

        const name = parsePeriodName(next.n, userData);

        setTitle((startingIn > 0)
            ? `${name} starting in ${startingIn} minute${startingIn !== 1 ? 's' : ''}.`
            : `${name} ending in ${endingIn} minute${endingIn !== 1 ? 's' : ''}, started ${-startingIn} minute${startingIn !== -1 ? 's' : ''} ago.`
            + ' (WATT)')

        let numToShow = startingIn >= 0 ? startingIn : endingIn;
        const isSeconds = numToShow === 0;
        if (isSeconds) numToShow = nextSeconds;

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
        if (appWindowRef.current) canvas.current.toBlob(b => b?.arrayBuffer().then(arrayBuf => appWindowRef.current?.setIcon(new Uint8Array(arrayBuf))))
    }, [date])

    return null;
}
