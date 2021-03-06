import * as React from "react";
import { Link } from "react-router-dom";
import { PlayerSetup } from '../../../../shared/model/player-setup';

export class Setup extends React.Component<{setPlayerConfig: (config: PlayerSetup) => void}, PlayerSetup> {
  constructor(props: any) {
    super(props);
    this.state = {
      gridSize: 3,
      playerCount: 2,
      name: 'anonymous',
    } as PlayerSetup;

    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeSize = this.handleChangeSize.bind(this);
    this.handleChangePlayer = this.handleChangePlayer.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChangeName(event: React.ChangeEvent<HTMLInputElement>) {
    let value = event.target.value;
    this.setState({name: value});
  }

  handleChangeSize(event: React.ChangeEvent<HTMLInputElement>) {
    let value = parseInt(event.target.value, 10);
    this.setState({gridSize: value});
  }

  handleChangePlayer(event: React.ChangeEvent<HTMLSelectElement>) {
    let value = parseInt(event.target.value, 10);
    this.setState({playerCount: value});
  }

  handleSubmit(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    this.props.setPlayerConfig(this.state);
  }

  render() {
    return (
      <div>
        <div className="form-group">
          <label>Name</label>
          <input type="name" id="name" className="form-control" placeholder="Enter your name" value={this.state.name} onChange={this.handleChangeName}/>
        </div>
        <div className="form-group">
          <label>Grid size {this.state.gridSize}x{this.state.gridSize}</label>
          <input type="range" step="1" min="3" max="10" className="form-control-range" value={this.state.gridSize} onChange={this.handleChangeSize}/>
        </div>
        <div className="form-group">
          <label>Players</label>
          <select className="form-control" value={this.state.playerCount} onChange={this.handleChangePlayer}>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>
        <Link to="/game" onClick={this.handleSubmit} className="btn btn-success btn-lg badge-pill">search game 🔍</Link>
      </div>
    );
  }
}