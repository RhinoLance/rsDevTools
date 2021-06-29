export class Bitwise {

	private _bit: number;

	constructor ( mask?: number){

		this._bit = mask !== undefined ? mask : 0;
	}

	public set(bit: number) {
		this._bit = this._bit | bit;
	}
	
	public test(bit: number) {
		
		//console.log( `Testing bitwise operators for ${this._bit} & ${bit} = ${this._bit & bit}`);

		return (this._bit & bit) !== 0;
	}
	
	public unset(bit: number) {
		return this.clear(bit);
	}
	public clear(bit: number) {
		this._bit &= ~bit;
	}
	
	public toggle(bit: number) {
		this._bit ^= bit;
	}

	public toNumber(): number {
		return this._bit;
	}

}