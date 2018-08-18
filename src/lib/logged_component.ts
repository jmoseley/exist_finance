import * as React from 'react';
const autobind = require('react-autobind'); //tslint:disable-line

import { Log } from './log';

export default class LoggedComponent<P = {}, S = {}, SS = any> extends React.Component<P, S, SS> {
  protected readonly log: Log;

  constructor(readonly props: P) {
    super(props);
    autobind(this);

    this.log = new Log(this.constructor.name);
  }
}
