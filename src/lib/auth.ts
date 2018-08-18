import * as auth0 from 'auth0-js';
import history from './history';
import { Log } from './log';

const clientId = 'uA1Sjl3BZ3PEpcTsKmnwjDsTm5O2pxmc';
const domain = 'jmoseley.auth0.com';

const log = new Log(`Auth`);

export class Auth {
  public auth0 = new auth0.WebAuth({
    audience: `https://${domain}/userinfo`,
    clientID: clientId,
    domain,
    redirectUri: 'http://localhost:3000/callback',
    responseType: 'token id_token',
    scope: 'openid',
  });

  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
  }

  public login() {
    this.auth0.authorize();
  }

  public handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        history.replace('/');
      } else if (err) {
        history.replace('/');
        log.error(err.toString());
      }
    });
  }

  public getAccessToken() {
    return localStorage.getItem('access_token');
  }

  public setSession(authResult: auth0.Auth0DecodedHash) {
    if (!authResult.expiresIn || !authResult.accessToken || !authResult.idToken) {
      log.error(`Invalid result, cannot set session.`);
      return;
    }

    // Set the time that the Access Token will expire at
    const expiresAt = JSON.stringify(authResult.expiresIn * 1000 + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
    // navigate to the home route
    history.replace('/home');
  }

  public logout() {
    // Clear Access Token and ID Token from local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    // navigate to the home route
    history.replace('/home');
  }

  public isAuthenticated() {
    // Check whether the current time is past the
    // Access Token's expiry time
    const expiresAtString = localStorage.getItem('expires_at');
    if (!expiresAtString) {
      return false;
    }

    const expiresAt = JSON.parse(expiresAtString);
    return new Date().getTime() < expiresAt;
  }
}

export default new Auth();
