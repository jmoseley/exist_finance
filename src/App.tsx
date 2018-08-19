import { AppBar, Grid, Toolbar, Typography } from '@material-ui/core';
import * as React from 'react';

import './App.css';

import FaqComponent from './components/faq';
import FooterComponent from './components/footer';
import LoginComponent from './components/login';
import LogoutComponent from './components/logout';
import UploadCsvComponent from './components/upload';
import { Auth } from './lib/auth';
import LoggedComponent from './lib/logged_component';

class App extends LoggedComponent<App.IProps> {
  public render() {
    const { isAuthenticated } = this.props.auth;

    return (
      <div>
        <AppBar position="sticky">
          <Toolbar>
            <Grid container={true} justify="space-between">
              <Typography variant="title" color="textSecondary">
                Exist + Mint!
              </Typography>
              {isAuthenticated() && <LogoutComponent auth={this.props.auth} />}
            </Grid>
          </Toolbar>
        </AppBar>
        <div className="content">
          <div className="main">
            {!isAuthenticated() && <LoginComponent auth={this.props.auth} />}
            {isAuthenticated() && <UploadCsvComponent auth={this.props.auth} />}
          </div>
          <FaqComponent />
          <FooterComponent />
        </div>
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
