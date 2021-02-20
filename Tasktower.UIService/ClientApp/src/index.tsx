import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { Auth0Provider } from "@auth0/auth0-react";
import registerServiceWorker from './registerServiceWorker';

const baseUrl: string | undefined = document.getElementsByTagName('base')[0].getAttribute('href') ?? undefined;
const rootElement = document.getElementById('root');

ReactDOM.render(
  <BrowserRouter basename={baseUrl}>
    <Auth0Provider
      domain="dev-cl8od7hx.us.auth0.com"
      clientId="OSafhsQn1OiTPAsuh79GZY04O7SaIAoe"
      redirectUri={window.location.origin}
      scope="openid email profile"
    >
      <App />
    </ Auth0Provider>
  </BrowserRouter>,
  rootElement);

registerServiceWorker();

