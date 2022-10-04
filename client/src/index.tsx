import React from 'react';
import {createRoot} from 'react-dom/client';

// Components
import App from './App';
import {BrowserRouter as Router} from 'react-router-dom';
import {FirebaseAppProvider} from 'reactfire';
import FirebaseProviders from './components/firebase/FirebaseProviders';

import './styles/tailwind.scss';


const firebaseConfig = {
    apiKey: 'AIzaSyAjmAlzXLNelfL4Ak7dMPXWg8-3wLcCwpY',
    authDomain: 'gunnwatt.firebaseapp.com',
    databaseURL: 'https://gunnwatt.firebaseio.com',
    projectId: 'gunnwatt',
    storageBucket: 'gunnwatt.appspot.com',
    messagingSenderId: '108805079121',
    appId: '1:108805079121:web:b08582f4c5c13763fb7870',
    measurementId: 'G-8EVM6G2Z8X'
}

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <FirebaseAppProvider firebaseConfig={firebaseConfig}>
            <FirebaseProviders>
                <Router>
                    <App/>
                </Router>
            </FirebaseProviders>
        </FirebaseAppProvider>
    </React.StrictMode>
);

// Immediately reload the page when a new service worker activates
navigator.serviceWorker.addEventListener('controllerchange', () => location.reload());
