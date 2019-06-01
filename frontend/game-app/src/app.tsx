import React from 'react';
import './app.scss';
import logo from './tic_tac_toe.svg';
import * as io from 'socket.io-client';
import { LiveStats } from '../../../shared/model/live-stats';

interface AppProps {
  stats: LiveStats;
  online: boolean;
}

export default class App extends React.Component<{}, AppProps> {

  constructor(whatever = {}) {
    super(whatever, {});
    this.state = {
      stats: {
        activeGames: 0,
        players: 0,
      },
      online: false
    };

    const socket = io.connect(`http://localhost:8080`);
    socket.on('connect', () => {
      this.setState({
        online: true
      })
    });
    socket.on('stats', (data: LiveStats) => {
      this.setState({
        stats: data
      })
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} alt="Tic Tac Toe" className="App-logo"></img>
          <div className="App-header-Text">
            <h1>
              Tic Tac Toe
            </h1>
            <p>
              <span>online players: <strong>{this.state.stats.players}</strong></span>
              <span>active games: <strong>{this.state.stats.activeGames}</strong></span>
            </p>
          </div>
          {/* <a
            className="App-link"
            href="about:blank"
            target="_blank"
            rel="noopener noreferrer"
          >
            START
          </a> */}
        </header>
        <section>
          {!this.state.online ? '' : <h3>ON</h3>}
        </section>
      </div>
    );
  }
}
