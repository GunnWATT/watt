import { useUser } from 'reactfire';
import { useState, useEffect } from 'react';
import { drawCodeOnCanvas } from '../../util/barcode';


export default function QuickBarcode() {
    const [showBarcode, setShowBarcode] = useState(false);
    const [showMessage, setShowMessage] = useState(true);

    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(0);

    useEffect(() => {
        setTimeout(() => {
            setShowMessage(false);
        }, 1500);
    }, [])

    useEffect(() => {
        if (showBarcode) setShowMessage(false);
    }, [showBarcode])

    useEffect(() => {
        function touchStart({ touches }: TouchEvent) {
            if (window.scrollY !== 0 && !showBarcode) return;
            setStart(touches[0].clientY);
        }

        function touchMove({ touches }: TouchEvent) {
            if (window.scrollY !== 0) return;
            setEnd(touches[0].clientY);
        }

        function touchEnd() {
            const offset = end - start;
            if (!showBarcode && offset > 50) setShowBarcode(true);
            if (showBarcode && offset < -50) setShowBarcode(false);
            setStart(0);
            setEnd(0);
        }

        window.addEventListener('touchstart', touchStart);
        window.addEventListener('touchmove', touchMove);
        window.addEventListener('touchend', touchEnd);

        return () => {
            window.removeEventListener('touchstart', touchStart);
            window.removeEventListener('touchmove', touchMove);
            window.removeEventListener('touchend', touchEnd);
        }
    }, [start, end, showBarcode])

    const { data: user } = useUser();
    if (!user) return null;

    const { displayName, email } = user;
    if (!displayName || !email) return null;

    const [, id] = email.match(/^[a-z]{2}(\d{5})@pausd\.us$/) || [];
    if (!id) return null;

    return (
        <div className="md:hidden">
            <div
                className={`absolute left-0 right-0 bg-background ${showBarcode ? "z-[60] m-3 p-3 rounded-md border-2 border-tertiary" : "-translate-y-[calc(100%-24px)] opacity-50 z-10 px-1.5 py-0.5"} transition-all duration-200`}
                onClick={() => setShowBarcode(!showBarcode)}
            >
                <div className="w-full h-24 px-6 py-3 rounded bg-white">
                    <canvas
                        ref={canvas => drawCodeOnCanvas(canvas, `950${id}`)}
                        className="w-full h-full"
                        style={{ imageRendering: 'pixelated' }}
                    />
                </div>
                <hr className="my-2" />
                <div className={`flex justify-between font-semibold ${!showBarcode && "text-sm"} transition-all duration-200`}>
                    {!showBarcode && (
                        <div className={`absolute flex h-5 left-0 right-0 text-center bg-background text-xs ${showMessage ? "opacity-100" : "opacity-0"} transition-all duration-200`}>
                            <p className="m-auto text-secondary">
                                Swipe down to reveal barcode
                            </p>
                        </div>
                    )}
                    <p>{displayName}</p>
                    <p className="text-secondary">950{id}</p>
                </div>
            </div>
            <div
                className={`fixed top-0 left-0 right-0 bottom-0 bg-black/50 opacity-0 pointer ${showBarcode && "opacity-100 touch-none z-40"} transition-all duration-200`}
                onClick={() => setShowBarcode(false)}
            />
        </div>
    )
}