import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

// Add these lines:
if (process.env.NODE_ENV !== 'production') {
  localStorage.setItem('debug', 'exist_plus_mint:*');
}

ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
