import * as React from "react";

export interface TileProps { compiler: string; framework: string; }

export class Tile extends React.Component<TileProps, {}> {
    render() {
        return <h1>Hello from { this.props.compiler } and { this.props.framework } !</h1>;
    }
}