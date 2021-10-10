import {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';


export default function Map() {
    const [map, setMap] = useState<JSX.Element | null>(null);

    // Render the portal in the useEffect to guarantee that all elements have been rendered into the DOM and
    // document.getElementById('content') is not null
    useEffect(() => setMap(ReactDOM.createPortal(
        <iframe
            className="map"
            width="100%"
            title="google-map"
            frameBorder="0"
            src="https://www.google.com/maps/embed/v1/place?key=AIzaSyCy3pN97ODnqOMvoGABYhN3bM4-qkro-eg&q=Henry+M+Gunn+High+School"
            // src="https://desmos.com/calculator" // Use desmos embed for testing, since the google map blocks localhost
            allowFullScreen>
        </iframe>,
        document.getElementById('content')!
    )), [])
    
    return (
        <>
            <h1>Map</h1>
            <p>Use the mouse to pan and ctrl+scroll to zoom.</p>
            {map}
        </>
    );
}
