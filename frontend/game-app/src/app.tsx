import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './app.scss';
import logo from './tic_tac_toe.svg';
import * as io from 'socket.io-client';
import { LiveStats } from '../../../shared/model/live-stats';
import { Setup } from './pages/setup';
import { Game } from './pages/game';

interface AppState {
  stats: LiveStats;
  online: boolean;
}

export default class App extends React.Component<{}, AppState> {

  socket: SocketIOClient.Socket;

  constructor(whatever = {}) {
    super(whatever);
    this.state = {
      stats: {
        activeGames: 0,
        players: 0,
      },
      online: false
    };

    this.initiateWebSocketHooks();
  }

  initiateWebSocketHooks() {
    this.socket = io.connect(`http://localhost:8080`);
    this.socket.on('connect', () => {
      this.setState({
        online: true
      })
    });
    this.socket.on('disconnect', () => {
      this.setState({
        online: false,
        stats: {
          activeGames: 0,
          players: 0,
        }
      })
    });
    this.socket.on('stats', (data: LiveStats) => {
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
        <Router>
          <Route exact path="/" render={() => !this.state.online ? 'offline' : <Link to="/join" className="btn btn-success btn-lg badge-pill">Start 🕹</Link>}/>
          <Route path="/join" component={Setup}/>
          <Route path="/game" component={Game}/>
        </Router>
        <section>

        </section>
      </div>
    );
  }
}
