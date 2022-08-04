import {useState} from 'react';
import {Dialog} from '@headlessui/react';
import {FaEye, MdClose} from 'react-icons/all';


type BarcodeRowProps = {
    name: string, code: string, you?: boolean,
    removeBarcode?: () => void,
    updateBarcodeName?: (v: string) => void,
    updateBarcodeValue?: (v: string) => void,
    updateBarcodes?: () => void
};
export default function BarcodeRow(props: BarcodeRowProps) {
    const {name, code, you, removeBarcode, updateBarcodeName, updateBarcodeValue, updateBarcodes} = props;
    const [barcodeOverlay, setOverlay] = useState(false);

    // Draws the barcode on a canvas element.
    // Call this using a ref callback to initialize `<canvas>` elements with the barcode.
    const drawCodeOnCanvas = (canvas: HTMLCanvasElement | null) => {
        if (!canvas) return;
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

    return (
        <>
            <div className="mb-4 flex items-center">
                <div className="relative flex-auto">
                    <input
                        className={'w-full text-center bg-transparent focus:outline-none' + (you ? ' cursor-default' : '')}
                        value={name}
                        readOnly={you}
                        onChange={e => updateBarcodeName && updateBarcodeName(e.target.value)}
                        onBlur={() => updateBarcodes && updateBarcodes()}
                    />
                    {/* TODO: we may want to add a focus ring to this */}
                    <input
                        className={'relative p-1 w-full h-[102px] bg-white/75 text-[2.5rem] text-black font-mono text-center z-10 focus:outline-none' + (you ? ' cursor-default' : '')}
                        value={code}
                        readOnly={you}
                        onChange={e => {
                            // Filter illegal characters out from the barcode.
                            // Note that Lowercase letters are capitalised when rendering the barcode so the cursor
                            // position doesn't reset when typing lowercase letters.
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
                    <canvas
                        ref={drawCodeOnCanvas}
                        className="absolute bottom-0 left-0 p-5 w-full h-[102px] bg-white"
                        style={{imageRendering: 'pixelated'}}
                    />
                </div>
                <div className="flex flex-col gap-4 p-4">
                    {!you && <MdClose className="w-6 h-6 cursor-pointer" onClick={() => removeBarcode && removeBarcode()}/>}
                    <FaEye className="w-6 h-6 cursor-pointer" onClick={() => setOverlay(true)}/>
                </div>
            </div>

            {/* TODO: is there a better way of making sure `flex` doesn't override `[hidden]`? */}
            {/* TODO: consider adding transitions */}
            <Dialog
                static
                open={barcodeOverlay}
                hidden={!barcodeOverlay}
                onClose={() => setOverlay(false)}
                className={barcodeOverlay ? 'fixed z-10 inset-0 flex items-center justify-center' : ''}
            >
                <Dialog.Overlay className="fixed inset-0 bg-black/80" />

                <div className="relative w-full h-[200px] p-6 flex items-center justify-center bg-white">
                    <Dialog.Description className="secondary absolute -bottom-8">
                        Click/tap anywhere to close.
                    </Dialog.Description>
                    <canvas
                        ref={drawCodeOnCanvas}
                        className="h-full w-80"
                        style={{imageRendering: 'pixelated'}}
                    />
                </div>
            </Dialog>
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
