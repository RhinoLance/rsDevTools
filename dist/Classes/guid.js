"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Guid = void 0;
class Guid {
    static _validator = new RegExp("^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$", "i");
    _value;
    static EMPTY = "00000000-0000-0000-0000-000000000000";
    constructor(guid) {
        if (!guid)
            throw new TypeError("Invalid argument; `value` has no value.");
        this._value = Guid.EMPTY;
        if (guid) {
            this._value = guid.toString();
        }
    }
    equals(other) {
        // Comparing string `value` against provided `guid` will auto-call
        // toString on `guid` for comparison
        return Guid.isGuid(other) && this._value == other;
    }
    ;
    isEmpty() {
        return this._value === Guid.EMPTY;
    }
    ;
    toString() {
        return this._value;
    }
    ;
    toJSON() {
        return this._value;
    }
    ;
    static gen(count) {
        var out = "";
        for (var i = 0; i < count; i++) {
            out += (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        return out;
    }
    static isGuid(value) {
        return value && (value instanceof Guid || Guid._validator.test(value.toString()));
    }
    ;
    static create() {
        return new Guid([Guid.gen(2), Guid.gen(1), Guid.gen(1), Guid.gen(1), Guid.gen(3)].join("-"));
    }
    ;
    static Empty() {
        return new Guid(Guid.EMPTY);
    }
    ;
    static raw = function () {
        return [Guid.gen(2), Guid.gen(1), Guid.gen(1), Guid.gen(1), Guid.gen(3)].join("-");
    };
}
exports.Guid = Guid;
//# sourceMappingURL=guid.js.map