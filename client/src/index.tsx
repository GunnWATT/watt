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
    // When new updates are detected, refresh the page
    onUpdate: () => window.location.reload()
}

serviceWorkerRegistration.register(swConfig);
