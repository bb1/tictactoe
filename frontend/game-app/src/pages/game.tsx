import * as React from "react";
import { PlayerSetup } from "shared/model/player-setup";
import { Player } from "../game-engine/player";
// import { Player } from '../../../../shared/game-engine/player';

export interface GameProps {
    playerConfig: PlayerSetup;
    websocket: SocketIOClient.Socket;
    history?: any
}

export interface GameState {
    player?: Player;

}

export class Game extends React.Component<GameProps, GameState> {
    constructor(props: any) {
        super(props);

        if (!this.props.playerConfig || !this.props.websocket) {
            if (this.props.history) this.props.history.push('/');
            else window.location.href = '/';
            return;
        }

        this.state = {
            player: null
        };

        this.props.websocket.emit('join', this.props.playerConfig, (player: any) => {
            this.setState({player: new Player(player._symbol, player._color, player._name)});
        });
    }

    render() {
        return (
            <div>
                <h1>GAME HERE!</h1>
                
                <code>{JSON.stringify(this.state.player)}</code>
                {/* <p>Hi {this.props.location.state.name}</p> */}
            </div>
        );
    }
}