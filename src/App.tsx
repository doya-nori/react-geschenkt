import React from 'react';
import './App.css';
import GameBoard from './components/GameBoard';

interface AppProps { }

class App extends React.Component<AppProps> {
  render = () => {
    return (
      <div className="App">
        {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
        <GameBoard />
      </div>
    );
  }
}

export default App;
