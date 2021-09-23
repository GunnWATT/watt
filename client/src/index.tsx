import React from 'react';
import ReactDOM from 'react-dom';

// Firebase
import FirebaseProviders from './firebase/FirebaseProviders';
import {FirebaseAppProvider} from 'reactfire';
import {fbconfig} from './firebase/config';

import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

import 'bootstrap/dist/css/bootstrap.css'
import './scss/index.scss';


ReactDOM.render(
    <React.StrictMode>
        <FirebaseAppProvider firebaseConfig={fbconfig}>
            <FirebaseProviders>
                <App/>
            </FirebaseProviders>
        </FirebaseAppProvider>
    </React.StrictMode>,
    document.getElementById('root')
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
