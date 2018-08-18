import Button from '@material-ui/core/Button';
import * as React from 'react';

import { Auth } from '../lib/auth';
import LoggedComponent from '../lib/logged_component';

export interface IProps {
  auth: Auth;
}

export default class LogoutComponent extends LoggedComponent<IProps> {
  public render() {
    return (
      <div>
        <Button variant="contained" onClick={this.onClick}>
          Logout
        </Button>
      </div>
    );
  }

  private onClick(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();

    this.props.auth.logout();
  }
}
