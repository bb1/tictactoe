import React from 'react';
import './app.scss';
import logo from './tic_tac_toe.svg';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} alt="Tic Tac Toe" className="App-logo"></img>
        <h1>
          Tic Tac Toe
        </h1>
        {/* <a
          className="App-link"
          href="about:blank"
          target="_blank"
          rel="noopener noreferrer"
        >
          START
        </a> */}
      </header>
    </div>
  );
}

export default App;
