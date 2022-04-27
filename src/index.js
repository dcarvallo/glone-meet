import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {Auth0Provider} from '@auth0/auth0-react';

const domain = process.env.REACT_APP_AUTH0_DOMAIN
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID

ReactDOM.render(
    <Auth0Provider cacheLocation="memory" useRefreshTokens={ true } domain={domain} clientId={clientId} redirectUri={window.location.href}>
        <App />
     </Auth0Provider>,
  document.getElementById('root')
);
