export declare class Guid {
    private static _validator;
    _value: string;
    private static EMPTY;
    constructor(guid: string);
    equals(other: string): any;
    isEmpty(): boolean;
    toString(): string;
    toJSON(): string;
    private static gen;
    static isGuid(value: any): any;
    static create(): Guid;
    static Empty(): Guid;
    static raw: () => string;
}
