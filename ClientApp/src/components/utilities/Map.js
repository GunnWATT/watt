import React from 'react';
import {Container} from 'reactstrap';
import {withScriptjs, withGoogleMap, GoogleMap, Marker} from "react-google-maps";

const MapWrapper = withScriptjs(
    withGoogleMap(props => (
        <GoogleMap
            defaultZoom={17}
            defaultCenter={{ lat: 37.402352, lng: -122.133319 }}
            defaultOptions={{
                scrollwheel: false,
                /*
                styles: [
                    {
                        featureType: "administrative",
                        elementType: "labels.text.fill",
                        stylers: [{ color: "#444444" }]
                    },
                    {
                        featureType: "landscape",
                        elementType: "all",
                        stylers: [{ color: "#f2f2f2" }]
                    },
                    {
                        featureType: "poi",
                        elementType: "all",
                        stylers: [{ visibility: "off" }]
                    },
                    {
                        featureType: "road",
                        elementType: "all",
                        stylers: [{ saturation: -100 }, { lightness: 45 }]
                    },
                    {
                        featureType: "road.highway",
                        elementType: "all",
                        stylers: [{ visibility: "simplified" }]
                    },
                    {
                        featureType: "road.arterial",
                        elementType: "labels.icon",
                        stylers: [{ visibility: "off" }]
                    },
                    {
                        featureType: "transit",
                        elementType: "all",
                        stylers: [{ visibility: "off" }]
                    },
                    {
                        featureType: "water",
                        elementType: "all",
                        stylers: [{ color: "#5e72e4" }, { visibility: "on" }]
                    }
                ]
                */
            }}
        >
            <Marker position={{ lat: 40.748817, lng: -73.985428 }} />
        </GoogleMap>
    ))
);

const Map = (props) => {
    return (
        <Container>
            <h1>Map</h1>
            <MapWrapper
                googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBDNSLCIZfrJ_IwOzUfO_CJjTRGkVtgaZc"
                loadingElement={<div style={{ height: `100%` }} />}
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
        </Container>
    );
}

export default Map;