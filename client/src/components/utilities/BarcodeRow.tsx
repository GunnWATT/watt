import {useState} from 'react';
import {Dialog} from '@headlessui/react';
import {FaEye, MdClose} from 'react-icons/all';

import {drawCodeOnCanvas, code39Values} from '../../util/barcode';


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
                        ref={canvas => drawCodeOnCanvas(canvas, code)}
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
                    <Dialog.Description className="text-secondary absolute -bottom-8">
                        Click/tap anywhere to close.
                    </Dialog.Description>
                    <canvas
                        ref={canvas => drawCodeOnCanvas(canvas, code)}
                        className="h-full w-80"
                        style={{imageRendering: 'pixelated'}}
                    />
                </div>
            </Dialog>
        </>
    )
}
