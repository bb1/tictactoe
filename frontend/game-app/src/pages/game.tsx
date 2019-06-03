import * as React from "react";
import { PlayerSetup } from "shared/model/player-setup";

export class Game extends React.Component<{location: {state: PlayerSetup}}> {
    constructor(props: {location: {state: PlayerSetup}}) {
        super(props);
    }

    render() {
        return (
            <div>
                <h1>GAME HERE!</h1>
                <p>Hi {this.props.location.state.name}</p>
            </div>
        );
    }
}