class Rules {

    private _playerList: Player[];

    constructor(private _playerCount = 2) {
        this._playerList = [];
    }

    get playerCount() {
        return this._playerCount;
    }

    public get playerList(): Player[] {
        // only returns a copy of the array (still the real player object though)
        return [].concat(this._playerList);
    }


    newPlayer(symbol: string, color?: string, name?: string) {
        if (this._playerList.length >= this._playerCount) {
            throw new Error('Game already full!');
            return;
        }
        const matchingIdent = this._playerList.find(p => p.symbol === symbol || p.color === color);
        if (matchingIdent) {
            throw new Error('Color or Symbol already taken!');
        }
        this._playerList.push(new Player(symbol, color, name));
    }

    kickPlayer(symbol: string) {
        const deleteIndex = this.playerList.findIndex(p => p.symbol === symbol);
        this._playerList.splice(deleteIndex, 1);
    }
}