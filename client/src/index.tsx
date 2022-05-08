import React from 'react';
import {createRoot} from 'react-dom/client';

// Firebase
import FirebaseProviders from './components/firebase/FirebaseProviders';
import {FirebaseAppProvider} from 'reactfire';

import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

import './styles/index.scss';
import './styles/_tailwind.scss';


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
                <App/>
            </FirebaseProviders>
        </FirebaseAppProvider>
    </React.StrictMode>
);

// Config for the service worker
const swConfig = {
    // When new updates are detected, activate the new service worker and refresh the page
    onUpdate: (r: ServiceWorkerRegistration) => {
        if (r.waiting) {
            r.waiting.postMessage({type: 'SKIP_WAITING'});
            r.waiting.onstatechange = function() {
                if (this.state === 'activated') window.location.reload();
            }
        }
    }
}

serviceWorkerRegistration.register(swConfig);
