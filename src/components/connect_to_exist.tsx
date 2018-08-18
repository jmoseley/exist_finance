import * as React from 'react';

import LoggedComponent from '../lib/logged_component';

export default class ConnectToExistComponent extends LoggedComponent {
  public render() {
    return <div><a href="#" onClick={this.onClick}>Connect to Exist</a></div>
  }

  private onClick(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    this.log.info('ha');
  }
}
