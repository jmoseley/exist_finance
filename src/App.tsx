import * as React from 'react';
import './App.css';
import ConnectToExistComponent from './components/connect_to_exist';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Exist + Mint Connector</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
        <ConnectToExistComponent />
      </div>
    );
  }
}

export default App;
