// TODO: use symbols instead of string
export enum PlayerSymbols {
    X, O, Z, N, T, W, P, A
}

export class Player {

    constructor(private _symbol = 'X', private _color = '#60ff95', private _name = 'n00b') {
        if (!/#[0-9a-fA-F]{6}/.test(_color)) {
            throw new Error('Invalid color!');
        }
    }

    get symbol() {
        return this._symbol;
    }

    get color() {
        return this._color;
    }

    get name() {
        return this._name;
    }
}