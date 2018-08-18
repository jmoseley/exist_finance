import * as React from 'react';

import { Auth } from '../lib/auth';
import LoggedComponent from '../lib/logged_component';

export interface IProps {
  auth: Auth;
}

export default class LoginComponent extends LoggedComponent<IProps> {
  public render() {
    return (
      <div>
        <a href="#" onClick={this.onClick}>
          Connect to Exist
        </a>
      </div>
    );
  }

  private onClick(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();

    this.props.auth.login();
  }
}
