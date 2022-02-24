import {useEffect, useRef, useState} from 'react';
import ReactDOM from 'react-dom';
import {Eye, X} from 'react-feather';


// TODO: instead of taking `readOnly` and `className`, directly take a boolean "you" specifically for the you barcode
// so that the abstraction moves down to this layer. I don't foresee us having to create other readOnly or custom behavior
// barcodes in the future.
type BarcodeRowProps = {
    name: string, code: string, readOnly?: boolean, className?: string,
    removeBarcode?: () => void,
    updateBarcodeName?: (v: string) => void,
    updateBarcodeValue?: (v: string) => void,
    updateBarcodes?: () => void
};
export default function BarcodeRow(props: BarcodeRowProps) {
    const {name, code, readOnly, removeBarcode, updateBarcodeName, updateBarcodeValue, updateBarcodes} = props;

    const [barcodeOverlay, setOverlay] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const overlayCanvasRef = useRef<HTMLCanvasElement>(null);

    const drawCodeOnCanvas = (canvas: HTMLCanvasElement) => {
        const c = canvas.getContext('2d')!;

        const chars = ['*', ...code.toUpperCase().split('').filter(char => code39Values.hasOwnProperty(char)), '*'];

        canvas.height = 100
        canvas.width = chars.length * 16 - 1
        c.clearRect(0, 0, canvas.width, canvas.height)
        c.fillStyle = 'white'
        c.fillRect(0, 0, canvas.width, canvas.height)
        c.fillStyle = 'black'
        for (let i = 0, x = 0; i < chars.length; i++) {
            const pattern = code39Values[chars[i]].toString(3);
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
        if (canvas) drawCodeOnCanvas(canvas);
    }, [code, canvasRef])

    useEffect(() => {
        const canvas = overlayCanvasRef.current;
        if (canvas) drawCodeOnCanvas(canvas);
    }, [code, overlayCanvasRef]);

    return (
        <>
            <div className="barcode-row flex items-center">
                <div className="canvas-wrapper flex-auto">
                    <input
                        className="w-full text-center"
                        value={name}
                        readOnly={readOnly}
                        onChange={e => updateBarcodeName && updateBarcodeName(e.target.value)}
                        onBlur={() => updateBarcodes && updateBarcodes()}
                    />
                    <input
                        className={`barcode-input relative bg-white/75 text-[2.5rem] text-black font-mono w-full text-center z-10 ${props.className || ''}`}
                        value={code}
                        readOnly={readOnly}
                        onChange={e => {
                            // Filter illegal characters out from the barcode.
                            // Note: Lowercase letters are capitalised when
                            // rendering the barcode (so the cursor position
                            // doesn't reset when typing lowercase letters).
                            updateBarcodeValue && updateBarcodeValue(
                                e.target.value
                                    .split('')
                                    .filter(char =>
                                        code39Values.hasOwnProperty(char.toUpperCase()))
                                    .join('')
                            )
                        }}
                        onBlur={() => updateBarcodes && updateBarcodes()}
                    />
                    <canvas ref={canvasRef} className="absolute bottom-0 left-0 w-full bg-white" style={{imageRendering: 'pixelated'}} />
                </div>
                <div className="flex flex-col gap-4 p-4">
                    {!readOnly && <X className="cursor-pointer" onClick={() => removeBarcode && removeBarcode()}/>}
                    <Eye className="cursor-pointer" onClick={() => setOverlay(true)}/>
                </div>
            </div>

            {/* Overlay using PORTALS */}
            {/* TODO: use fancy headless-ui modals for this */}
            {ReactDOM.createPortal((
                <div className="barcode-overlay" hidden={!barcodeOverlay} onClick={() => setOverlay(false)}>
                    <div className="barcode-overlay-warning">Click/tap anywhere to close.</div>

                    <div className="barcode-overlay-bar">
                        <canvas ref={overlayCanvasRef} style={{imageRendering: 'pixelated'}} />
                    </div>
                </div>
            ), document.body)}
        </>
    )
}

// Ported from UGWA
// https://github.com/Orbiit/gunn-web-app/blob/master/js/code39.js
const code39Values: {[key: string]: number} = {
    '0': 349, '1': 581, '2': 419, '3': 661, '4': 347, '5': 589, '6': 427, '7': 341, '8': 583, '9': 421,
    A: 599, K: 605, U: 527, B: 437, L: 443, V: 311, C: 679, M: 685, W: 553, D: 383, N: 389, X: 293,
    E: 625, O: 631, Y: 535, F: 463, P: 469, Z: 319, G: 359, Q: 371, '-': 287, H: 601, R: 613, '.': 529,
    I: 439, S: 451, ' ': 313, J: 385, T: 397, '*': 295, '+': 2521, '/': 2467, $: 2461, '%': 3007
}
