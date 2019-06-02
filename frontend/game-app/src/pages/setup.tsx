import * as React from "react";
import { Link } from "react-router-dom";

export class Setup extends React.Component<{}> {
  render() {
    return (
      <div>
        <div className="form-group">
          <label>Name</label>
          <input type="name" id="name" className="form-control" placeholder="Enter your name"/>
        </div>
        <div className="form-group">
          <label>Grid size</label>
          <input type="range" step="1" min="3" max="10" className="form-control-range"/>
        </div>
        <div className="form-group">
          <label>Players</label>
          <select className="form-control">
            <option>2</option>
            <option>3</option>
            <option>4</option>
          </select>
        </div>
        <Link to="/game" className="btn btn-success btn-lg badge-pill">search game</Link>
      </div>
    );
  }
}