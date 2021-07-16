import { execFileSync, execSync } from "child_process";

describe("uploadSourceFormContent", () => {


	it( "runScript_withoutConfigFile_shouldError", ()=> {

		try {
			const child = execFileSync("node"
				,["./dist/bin/uploadSourceFormContent"]
				,{shell: true}
			);

			expect(true).toBe(false);
		}
		catch(err) {
			expect(JSON.stringify(err.stderr.toString('utf8'))).toContain(
				"error: missing required argument 'configFile'"
			);
		}

	});

	it( "runScript_withoutConfigFile_shouldError", ()=> {
/*
		try {
			const child = execFileSync("node"
				,["./dist/bin/uploadSourceFormContent"]
				,{shell: true}
			);

			expect(true).toBe(false);
		}
		catch(err) {
			expect(JSON.stringify(err.stderr.toString('utf8'))).toContain(
				"error: missing required argument 'configFile'"
			);
		}
*/
	});

});