import * as React from 'react';
import './App.css';
import LoginComponent from './components/login';
import LogoutComponent from './components/logout';
import { Auth } from './lib/auth';
import LoggedComponent from './lib/logged_component';

class App extends LoggedComponent<App.IProps> {
  public render() {
    const { isAuthenticated, getAccessToken } = this.props.auth;

    this.log.info(`isAuth: ${isAuthenticated()} accessToken: ${getAccessToken()}`);

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Exist + Mint Connector</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
        {!isAuthenticated() && <LoginComponent auth={this.props.auth} />}
        {isAuthenticated() && <LogoutComponent auth={this.props.auth} />}
      </div>
    );
  }
}

namespace App {
  export interface IProps {
    auth: Auth;
  }
}

export default App;
