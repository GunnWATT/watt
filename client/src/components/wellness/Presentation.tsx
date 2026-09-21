import { useState, useEffect } from 'react';

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height
    };
}

function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
}


export default function Presentation() {
    const { height, width } = useWindowDimensions();
    let Windowheight = height * 0.85;
    let Windowwidth = width * 0.85;
    if (width >= 768) {
        Windowheight = height * 0.65;
        Windowwidth = width * 0.65;
    }
    if (Windowheight / 10 * 16 > Windowwidth) {
        Windowheight = Windowwidth / 16 * 10;
    }
    else {
        Windowwidth = Windowheight / 10 * 16;
    }
    return (
        <>
            <div className="mt-4">
                <iframe title="Student's Guide To Safety" src="https://docs.google.com/presentation/d/e/2PACX-1vQcCWQFnTvmHiH13jphkIOL5oseIURZLOlBDJtMJ8yr1YBIKmaklI-fsTLUB3Jzg8YuUSNbHDaaWlky/pubembed" style={{ width: Windowwidth, height: Windowheight }}></iframe>
            </div>
        </>
    );
}