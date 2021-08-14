import React, { useState, useEffect, useRef } from 'react';
import firebase from '../../firebase/Firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

import { Eye } from 'react-feather'
import ReactDOM from 'react-dom';

/*
  ORIGINALLY MADE BY SEAN (https://github.com/SheepTester), PORTED FROM GUNN.APP
  
  "
  CREDITS TO WIKIPEDIA
  https://en.wikipedia.org/wiki/Code_39
  I USED THEIR JQUERY AS WELL TO TURN THEIR HELPFUL TABLE INTO JSON THAT I COPIED AND PASTED HERE
  "
  - SEAN
*/

const code39Values: {[key:string]: number} = {
    '0': 349,
    '1': 581,
    '2': 419,
    '3': 661,
    '4': 347,
    '5': 589,
    '6': 427,
    '7': 341,
    '8': 583,
    '9': 421,
    A: 599,
    K: 605,
    U: 527,
    B: 437,
    L: 443,
    V: 311,
    C: 679,
    M: 685,
    W: 553,
    D: 383,
    N: 389,
    X: 293,
    E: 625,
    O: 631,
    Y: 535,
    F: 463,
    P: 469,
    Z: 319,
    G: 359,
    Q: 371,
    '-': 287,
    H: 601,
    R: 613,
    '.': 529,
    I: 439,
    S: 451,
    ' ': 313,
    J: 385,
    T: 397,
    '*': 295,
    '+': 2521,
    '/': 2467,
    $: 2461,
    '%': 3007
}

const Barcode = () => {
    const [code, setCode] = useState('95000000');

    const auth = firebase.auth;
    const [user] = useAuthState(auth);

    const [barcodeOverlay, setOverlay] = useState(false);

    useEffect(() => {
        if (user?.email) {
            // supposedly the [2, 7)th digits (0 indexed) are the ID
            const id950 = user.email.slice(2, 7);
            const validID = id950.split('').every(char => '0123456789'.includes(char)); // make sure all are digits!

            if (validID) {
                setCode('950' + (id950))
            }
        }
    }, [user]);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const overlayCanvasRef = useRef<HTMLCanvasElement>(null);

    const drawCodeOnCanvas = (canvas:HTMLCanvasElement) => {
        const c = canvas.getContext('2d')!;

        const chars = ['*', ...code.split(''), '*'];

        canvas.height = 100
        canvas.width = chars.length * 16 - 1
        c.clearRect(0, 0, canvas.width, canvas.height)
        c.fillStyle = 'white'
        c.fillRect(0, 0, canvas.width, canvas.height)
        c.fillStyle = 'black'
        for (let i = 0, x = 0; i < chars.length; i++) {
            const pattern = code39Values[chars[i]].toString(3)
            for (let j = 0; j < pattern.length; j++)
                switch (pattern[j]) {
                    case '2':
                        c.fillRect(x, 0, 3, canvas.height)
                        x += 4
                        break
                    case '1':
                        c.fillRect(x, 0, 1, canvas.height)
                        x += 2
                        break
                    case '0':
                        x += 2
                        break
                }
        }
    }

    useEffect( () => {
        const canvas = canvasRef.current;

        if (canvas) {
            drawCodeOnCanvas(canvas);
        }
    }, [code, canvasRef])

    useEffect(() => {
        const canvas = overlayCanvasRef.current;

        if (canvas) {
            drawCodeOnCanvas(canvas);
        }
    }, [code, overlayCanvasRef]);

    
    return (
        <div>
            <h1>Barcode</h1>
            <hr />

            <div className="barcode-burrito">
                <input className="barcode-input" value={code} onChange={e => setCode(e.target.value)} />

                <canvas ref={canvasRef} style={{
                    imageRendering: 'pixelated'
                }} />

                <Eye style={{
                    cursor: 'pointer'
                }} onClick={() => setOverlay(true)}/>
            </div>

            {/* Overlay using PORTALS */}
            {ReactDOM.createPortal((
                <div className="barcode-overlay" hidden={!barcodeOverlay} onClick={() => setOverlay(false)}>
                    <div className="barcode-overlay-warning">Click/tap anywhere to close.</div>

                    <div className="barcode-overlay-bar">
                        <canvas ref={overlayCanvasRef} style={{
                            imageRendering: 'pixelated'
                        }} />
                    </div>
                </div>
            ), document.body)}

        </div>
    );
}

export default Barcode;