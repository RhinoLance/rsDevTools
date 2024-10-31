"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bitwise = void 0;
class Bitwise {
    constructor(mask) {
        this._bit = mask !== undefined ? mask : 0;
    }
    set(bit) {
        this._bit = this._bit | bit;
    }
    test(bit) {
        //console.log( `Testing bitwise operators for ${this._bit} & ${bit} = ${this._bit & bit}`);
        return (this._bit & bit) !== 0;
    }
    unset(bit) {
        return this.clear(bit);
    }
    clear(bit) {
        this._bit &= ~bit;
    }
    toggle(bit) {
        this._bit ^= bit;
    }
    toNumber() {
        return this._bit;
    }
}
exports.Bitwise = Bitwise;
//# sourceMappingURL=Bitwise.js.map