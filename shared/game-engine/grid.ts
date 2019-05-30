import { Player } from "./player";
import { Rules } from "./rules";

export class Grid {
    grid: string[][];

    constructor(private max_x = 3, private max_y = 3, private rules: Rules) {
        this.grid = new Array();
        while (this.grid.length - 1 < max_x) {
            this.grid.push(new Array(max_y));
        }
    }
    
    playerAction(x: number, y: number, player: Player) {
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
    }

    private checkBounds(x: number, y: number): boolean {
        return x >= 0 && x < this.max_x && y >= 0 && y < this.max_y;
    }

}