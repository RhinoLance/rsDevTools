import { execFileSync, execSync } from "child_process";

describe("setPermissions", () => {


	it( "runScript_withoutUserId_shouldError", ()=> {

		try {
			const child = execFileSync("node"
				,["./dist/bin/setPermissions"]
				,{shell: true}
			);

			expect(true).toBe(false);
		}
		catch(err) {
			expect(JSON.stringify(err.stderr.toString('utf8'))).toContain(
				"error: required option '-u --user <string>' not specified"
			);
		}

	});

	it( "runScript_withAllArgs_shouldComplete", ()=> {

		try {
			const child = execFileSync("node"
				,["./dist/bin/setPermissions", "./rhinospect.conf.json", "-u anotherUser@rhinosw.com",  "-c test", "-n test note"]
				,{shell: true}
			);

			expect(true).toBe(true);
		}
		catch(err) {
			expect(JSON.stringify(err.stderr.toString('utf8'))).toBe("Empty");
		}

	});

});