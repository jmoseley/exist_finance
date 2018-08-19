import { MuiThemeProvider } from '@material-ui/core';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import 'typeface-roboto';

import './index.css';
import theme from './lib/theme';
import registerServiceWorker from './registerServiceWorker';
import { makeMainRoutes } from './routes';

if (process.env.NODE_ENV !== 'production') {
  localStorage.setItem('debug', 'exist_plus_mint:*');
}

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <BrowserRouter>{makeMainRoutes()}</BrowserRouter>
  </MuiThemeProvider>,
  document.getElementById('root') as HTMLElement,
);
registerServiceWorker();
