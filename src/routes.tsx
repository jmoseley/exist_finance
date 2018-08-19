import * as React from 'react';
import { Omit } from 'react-router';
import { Route, Router } from 'react-router-dom';
import App from './App';
import Callback from './components/callback';
import auth from './lib/auth';
import history from './lib/history';

const handleAuthentication = (nextState: any) => {
  if (/access_token|id_token|error/.test(nextState.location.hash)) {
    auth.handleAuthentication();
  }
};

function renderApp(props: Omit<App.IProps, 'auth'>) {
  return <App auth={auth} {...props} />;
}

function handleAuthCallbackRoute(props: any) {
  handleAuthentication(props);
  return <Callback {...props} />;
}

export const makeMainRoutes = () => {
  return (
    <Router history={history}>
      <div>
        <Route path="/" render={renderApp} />
        <Route path="/callback" render={handleAuthCallbackRoute} />
      </div>
    </Router>
  );
};
