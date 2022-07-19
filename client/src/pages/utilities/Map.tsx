import {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import {Helmet} from 'react-helmet-async';
import imageMap from '../../assets/imageMap.png';

// Components
import ImageMap from '../../components/utilities/ImageMap';
import ImageBox from '../../components/layout/ImageBox';


export default function Map() {
    const [showMap, setShowMap] = useState(false);

    // const [gunnMap, setGunnMap] = useState<JSX.Element | null>(null)

    // Render the portal in the useEffect to guarantee that all elements have been rendered into the DOM and
    // document.getElementById('content') is not null
    // useEffect(() => setMap(ReactDOM.createPortal(
    //     <iframe
    //         className="map"
    //         width="100%"
    //         title="google-map"
    //         frameBorder="0"
    //         // src="https://www.google.com/maps/embed/v1/place?key=AIzaSyCy3pN97ODnqOMvoGABYhN3bM4-qkro-eg&q=Henry+M+Gunn+High+School"
    //         src="https://desmos.com/calculator" // Use desmos embed for testing, since the google map blocks localhost
    //         allowFullScreen>
    //     </iframe>

        
    //     ,
    //     document.getElementById('content')!
    // )), [])

    return (
        <>
            <Helmet>
                <title>Map | WATT</title>
                <meta property="og:title" content="Map | WATT" />
                <meta property="twitter:title" content="Map | WATT" />

                {/* TODO: make description better */}
                <meta name="description" content="Interactive Gunn maps to help you navigate around campus." />
                <meta name="og:description" content="Interactive Gunn maps to help you navigate around campus." />
                <meta name="twitter:description" content="Interactive Gunn maps to help you navigate around campus." />
            </Helmet>

            <h1 className="mb-5">Map</h1>

            <ImageBox
                src={imageMap}
                onClick={() => setShowMap(true)}
                header="Image Map"
                caption="Use the mouse to pan and scroll to zoom."
            />

            {/* TODO: use <Dialog> for this to trap focus and generally be more screen-reader friendly */}
            {showMap && ReactDOM.createPortal(
                <ImageMap close={() => setShowMap(false)} />,
                document.getElementById('content')!
            )}
        </>
    );
}
