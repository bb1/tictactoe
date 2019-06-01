import { GamePlayerList } from "../../shared/game-engine/game-player-list";
import { Grid } from "../../shared/game-engine/grid";
import { Player } from "../../shared/game-engine/player";

interface ActiveGame {
    playerList: GamePlayerList;
    grid: Grid;
}

export class GameManager {
    activeGames: ActiveGame[];

    private readonly ALL_SYMBOLS = ['X', 'O', 'Z', 'N', 'P', 'V'];
    private readonly PRESET_COLORS = ['#fd5252', '#61dafb', '#60ff95', '#d8fd52', '#a252fd', '#23a323'];

    /**
     * Looks for a game with empty slots - if not create a new game
     * @param name 
     * @param playerCount 
     * @param maxX 
     * @param maxY 
     */
    newPlayer(name: string, playerCount = 2, maxX = 3, maxY = 3) {
        const availableGames = this.activeGames.filter(g => {
            if (g.playerList.maxPlayerCount > g.playerList.playerCount) {
                return false; // game full
            }
            if (g.playerList.maxPlayerCount !== playerCount) {
                return false; // player count differs
            }
            if (g.grid.maxX !== maxX || g.grid.maxY !== maxY) {
                return false; // grid differs
            }
            return true;
        });
        let joinedGame: ActiveGame;
        for (const game of availableGames) {
            const newPlayer = this.createPlayerForGame(name, game.playerList);
            try {
                game.playerList.newPlayer(newPlayer);
                joinedGame = game;
                break;
            } catch(e) {
                // someone else already joined? player already in the game? Try next but log.
                console.warn(e);
            }
        }
        if (!joinedGame) {
            const playerList = new GamePlayerList(playerCount);
            const newPlayer = this.createPlayerForGame(name, playerList);
            playerList.newPlayer(newPlayer);
            joinedGame = {
                playerList,
                grid: new Grid(maxX, maxY, playerList)
            }
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