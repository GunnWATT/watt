import 'bootstrap/dist/css/bootstrap.css'
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

import './scss/index.css';


ReactDOM.render(
  <React.StrictMode>
    <App />
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
