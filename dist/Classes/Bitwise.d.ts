export declare class Bitwise {
    private _bit;
    constructor(mask?: number);
    set(bit: number): void;
    test(bit: number): boolean;
    unset(bit: number): void;
    clear(bit: number): void;
    toggle(bit: number): void;
    toNumber(): number;
}
