import * as React from "react";

export interface FieldProps { compiler: string; framework: string; }

export class Field extends React.Component<FieldProps, {}> {
    render() {
        return <h1>Hello from { this.props.compiler } and { this.props.framework } !</h1>;
    }
}