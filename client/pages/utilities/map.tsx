import {ReactPortal, useEffect, useState} from 'react';
import ReactDOM from 'react-dom';

// Components
import UtilitiesPage from '../../components/utilities/UtilitiesPage';
import ImageMap from '../../components/utilities/ImageMap';
import ImageBox from '../../components/layout/ImageBox';


export default function Map() {
    // TODO: think about combining these into one
    // Specifically, if / when more map options are added, portal can be changed between different portals for each map
    // with `null` representing all maps being closed
    const [showMap, setShowMap] = useState(false);
    const [portal, setPortal] = useState<ReactPortal | null>(null);

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
    //     </iframe>,
    //     document.getElementById('content')!
    // )), [])

    // Render the portal in useEffect to ensure this only runs client-side and after the DOM has fully loaded
    useEffect(() => {
        setPortal(ReactDOM.createPortal(
            <ImageMap close={() => setShowMap(false)} />,
            document.getElementById('content')!
        ));
    }, []);

    return (
        <UtilitiesPage>
            <h1>Map</h1>
            <br />
            <ImageBox
                src="/imageMap.png"
                onClick={() => setShowMap(true)}
                header="Image Map"
                caption="Use the mouse to pan and scroll to zoom."
            />

            {showMap && portal}
        </UtilitiesPage>
    );
}
