import { GamePlayerList } from "shared/game-engine/game-player-list";
import { Grid } from "shared/game-engine/grid";

interface ActiveGame {
    playerList: GamePlayerList;
    grid: Grid;
}

export class GameManager {
    activeGames: ActiveGame[];

    newPlayer(name: string) {
        // TODO: look for game with empty slots - if not create a new game
        // TODO: assign a color and symbol that isn't picked yet
    }
}