import { GamePlayerList } from "shared/game-engine/game-player-list";
import { Grid } from "shared/game-engine/grid";
import { Player } from "shared/game-engine/player";

interface ActiveGame {
    playerList: GamePlayerList;
    grid: Grid;
}

export class GameManager {
    activeGames: ActiveGame[];

    private readonly ALL_SYMBOLS = ['X', 'O', 'Z', 'N', 'P', 'V'];
    private readonly PRESET_COLORS = ['#fd5252', '#61dafb', '#60ff95', '#d8fd52', '#a252fd', '#23a323'];

    newPlayer(name: string) {
        // look for game with empty slots - if not create a new game
        const availableGames = this.activeGames.filter(g => g.playerList.maxPlayerCount > g.playerList.playerCount);
        for (const game of availableGames) {
            const newPlayer = this.createPlayerForGame(name, game.playerList);
            try {
                game.playerList.newPlayer(newPlayer);
            } catch(e) {
                // someone else already joined? player already in the game? Try next but log.
                console.warn(e);
            }
            break;
        }
        // TODO: notify clients
        
    }

    /**
     * Creates a new player and assign a color and symbol that isn't picked yet
     */
    private createPlayerForGame(name: string, game: GamePlayerList): Player {
        const otherPlayerSymbols = game.playerList.map(p => p.symbol);
        const newSymbol = this.ALL_SYMBOLS.filter(s => !otherPlayerSymbols.includes(s))[0];
        const otherPlayerColors = game.playerList.map(p => p.color);
        const newColor = this.PRESET_COLORS.filter(s => !otherPlayerColors.includes(s))[0];
        return new Player(newSymbol, newColor, name);
    }
}