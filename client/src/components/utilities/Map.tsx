import React from 'react';
import {Container} from 'reactstrap';


const Map = () => {
    return (
        <Container>
            <h1>Map</h1>
            <iframe
                width="100%"
                height="450"
                title="google-map"
                frameBorder="0"
                src="https://www.google.com/maps/embed/v1/place?key=AIzaSyCy3pN97ODnqOMvoGABYhN3bM4-qkro-eg&q=Henry+M+Gunn+High+School"
                allowFullScreen>
            </iframe>

            {/*
             <MapWrapper
                googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCy3pN97ODnqOMvoGABYhN3bM4-qkro-eg"
                loadingElement={<Loading />}
                containerElement={
                    <div
                        style={{ height: `600px` }}
                        className="map-canvas"
                        id="map-canvas"
                    />
                }
                mapElement={
                    <div style={{ height: `100%`, borderRadius: "inherit" }} />
                }
            />
            */}

        </Container>
    );
}

export default Map;