import * as React from 'react';
import './App.css';
import LoginComponent from './components/login';
import LogoutComponent from './components/logout';
import UploadCsvComponent from './components/upload';
import { Auth } from './lib/auth';
import LoggedComponent from './lib/logged_component';

class App extends LoggedComponent<App.IProps> {
  public render() {
    const { isAuthenticated } = this.props.auth;

    this.log.info(`isAuth: ${isAuthenticated()}`);

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Exist + Mint Connector</h1>
        </header>
        {!isAuthenticated() && <LoginComponent auth={this.props.auth} />}
        {isAuthenticated() && (
          <div>
            <UploadCsvComponent auth={this.props.auth} />
            <LogoutComponent auth={this.props.auth} />
          </div>
        )}
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
