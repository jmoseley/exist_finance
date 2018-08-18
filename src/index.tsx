import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { BrowserRouter } from 'react-router-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { makeMainRoutes } from './routes';

if (process.env.NODE_ENV !== 'production') {
  localStorage.setItem('debug', 'exist_plus_mint:*');
}

ReactDOM.render(<BrowserRouter>{makeMainRoutes()}</BrowserRouter>, document.getElementById('root') as HTMLElement);
registerServiceWorker();
