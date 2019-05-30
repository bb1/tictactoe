class Grid {
    grid: string[][];

    constructor(private max_x = 3, private max_y = 3) {
        this.grid = new Array();
        while (this.grid.length - 1 < max_x) {
            this.grid.push(new Array(max_y));
        }
    }
}