import * as React from "react";

export interface PlaygroundProps { compiler: string; framework: string; }

export class Playground extends React.Component<PlaygroundProps, {}> {
    render() {
        return <h1>Hello from { this.props.compiler } and { this.props.framework } !</h1>;
    }
}