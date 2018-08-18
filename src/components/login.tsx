import { Button, Grid } from '@material-ui/core';
import * as React from 'react';

import './login.css';

import { Auth } from '../lib/auth';
import LoggedComponent from '../lib/logged_component';

export interface IProps {
  auth: Auth;
}

export default class LoginComponent extends LoggedComponent<IProps> {
  public render() {
    return (
      <Grid className="login-container" container={true} alignItems="center" justify="center">
        <Button variant="contained" onClick={this.onClick}>
          Connect to Exist
        </Button>
      </Grid>
    );
  }

  private onClick(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();

    this.props.auth.login();
  }
}
