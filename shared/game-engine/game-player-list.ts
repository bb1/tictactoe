import { Player } from "./player";

export interface SavedGameState {
    /** to identify the game on the server/client */
    gameId: number;
    maxPlayerCount: number;
    playerList: Player[];
    nextPlayerIndex: number;
}

export class GamePlayerList {

    private _playerList: Player[];
    private _nextPlayerIndex: number;
    private _gameId: number;

    constructor(private _maxPlayerCount = 2, gameSave?: SavedGameState, gameId?: number) {
        if (gameSave) {
            this._playerList = gameSave.playerList;
            this._nextPlayerIndex = gameSave.nextPlayerIndex;
            this._gameId = gameSave.gameId;
            this._maxPlayerCount = gameSave.maxPlayerCount;
        } else {
            this._playerList = [];
            this._nextPlayerIndex = 0;
            this._gameId = gameId;
        }
    }

    get maxPlayerCount() {
        return this._maxPlayerCount;
    }

    get playerCount() {
        return this._playerList.length;
    }

    get playerList(): Player[] {
        // only returns a copy of the array (still the real player object though)
        return [].concat(this._playerList);
    }

    get nextPlayer() {
        const nextPlayer = this._playerList[this._nextPlayerIndex++];
        this._nextPlayerIndex = this._playerList.length < this._nextPlayerIndex ? this._nextPlayerIndex : 0;
        return nextPlayer;
    }

    public get gameId(): number {
        return this._gameId;
    }

    newPlayer(player: Player) {
        if (this.playerCount >= this._maxPlayerCount) {
            throw new Error('Game already full!');
        }
        const matchingIdent = this._playerList.find(p => p.symbol === player.symbol || p.color === player.color);
        if (matchingIdent) {
            throw new Error('Color or Symbol already taken!');
        }
        this._playerList.push(player);
    }

    kickPlayer(symbol: string) {
        const deleteIndex = this.playerList.findIndex(p => p.symbol === symbol);
        this._playerList.splice(deleteIndex, 1);
    }

    shufflePlayers() {
        this._playerList.sort(() => {
            return Math.random() < 0.5 ? -1 : 1;
        });
    }

    exportState(): SavedGameState {
        return {
            gameId: this._gameId,
            playerList: this.playerList,
            nextPlayerIndex: this._nextPlayerIndex,
            maxPlayerCount: this.maxPlayerCount
        }
    }
}