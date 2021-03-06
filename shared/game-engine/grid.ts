import { Player } from "./player";
import { GamePlayerList } from "./game-player-list";

const relativePosition = {
    TopLeft: [-1, 1],
    Top: [0, 1],
    TopRight: [1, 1],
    Left: [0, -1],
    Right: [0, 1],
    BottomLeft: [-1, -1],
    Bottom: [-1, 0],
    BottomRight: [-1, -1],
}

export class Grid {
    grid: string[][];
    winningFields: number[][];

    constructor(private _maxX = 3, private _maxY = 3, private rules: GamePlayerList) {
        this.grid = new Array();
        while (this.grid.length < _maxX) {
            this.grid.push(new Array(_maxY));
        }
    }

    get maxX() {
        return this._maxX;
    }

    get maxY() {
        return this._maxY;
    }
    
    /**
     * A player performs an action. Returns true if he won with this move!
     * @param x Position X
     * @param y Position Y
     * @param player Player
     */
    playerAction(x: number, y: number, player: Player): boolean {
        if (!this.checkBounds(x, y)) {
            throw new Error('Out of bounds!');
        }
        if (this.grid[x][y] !== null) {
            throw new Error('Already taken!');
        }
        if (this.rules.nextPlayer !== player) {
            throw new Error('Not your turn!');
        }
        this.grid[x][y] = player.symbol;

        return this.checkForWinCondition(x, y, player.symbol);
    }

    clearGrid() {
        this.grid.forEach(yAxis => {
            for (let i = 0; i < yAxis.length; i++) {
                yAxis[i] = null;
            }
        });
        this.winningFields = null;
    }

    private checkBounds(x: number, y: number): boolean {
        return x >= 0 && x < this._maxX && y >= 0 && y < this._maxY;
    }

    /**
     * Checks in all directions if the player has already won
     * // TODO: make public for AI
     * @param x
     * @param y 
     * @param symbol 
     */
    private checkForWinCondition(x: number, y: number, symbol: string) {
        const foundPositions: number[][] = [];
        const winningFields: number[][] = [[x, y]];
        for (const key in relativePosition) {
            const pos = (relativePosition as any)[key] as number[];
            const newX = x + pos[0];
            const newY = y + pos[1];
            if (this.checkBounds(newX, newY)) {
                if (symbol === this.grid[newX][newY]) {
                    foundPositions.push([newX, newY]);
                    // follow direction
                    const nextX = newX + pos[0];
                    const nextY = newY + pos[1];
                    if (this.checkBounds(nextX, nextY)) {
                        if (symbol === this.grid[nextX][nextY]) {
                            foundPositions.push([nextX, nextY]);
                            // WIN!
                            winningFields.push([newX, newY]);
                            winningFields.push([nextX, nextY]);
                        }
                    }
                    // opposing direction already found?
                    const opposingX = newX + pos[0] * -1;
                    const opposingY = newY + pos[1] * -1;
                    if (this.checkBounds(opposingX, opposingY)) {
                        if (symbol === this.grid[opposingX][opposingY]) {
                            foundPositions.push([opposingX, opposingY]);
                            // WIN!
                            winningFields.push([newX, opposingY]);
                            winningFields.push([opposingX, opposingY]);
                        }
                    }
                }
            }
        }
        this.winningFields = winningFields;
        return winningFields.length >= 3;
    }

}