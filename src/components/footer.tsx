import { Button, Divider, Grid, Typography } from '@material-ui/core';
import * as React from 'react';

import './footer.css';

import LoggedComponent from '../lib/logged_component';

export default class FooterComponent extends LoggedComponent {
  public render() {
    return (
      <div className="content">
        <Divider />
        <Grid container={true} className="buttons-container" justify="center" alignContent="center" alignItems="center">
          <Button href="https://www.buymeacoffee.com/5fslX1RET" target="_blank">
            <Typography variant="caption">Buy Me a Coffee</Typography>
          </Button>{' '}
          |{' '}
          <Button href="https://github.com/jmoseley/exist_finance" target="_blank">
            <Typography variant="caption">Source Code</Typography>
          </Button>
        </Grid>
      </div>
    );
  }
}
