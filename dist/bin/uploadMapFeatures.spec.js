"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
describe("uploadMapFeatures", () => {
    it("runScript_withoutConfigFile_shouldError", () => {
        try {
            const child = (0, child_process_1.execFileSync)("node", ["./dist/bin/uploadMapFeatures"], { shell: true });
            expect(true).toBe(false);
        }
        catch (err) {
            expect(JSON.stringify(err.stderr.toString('utf8'))).toContain("error: missing required argument 'configFile'");
        }
    });
    it("runScript_withoutDataFile_shouldError", () => {
        try {
            const child = (0, child_process_1.execFileSync)("node", ["./dist/bin/uploadMapFeatures", "./path-to-dummy-config.json", "-d ./path-to-dummy-mapData.json"], { shell: true });
            expect(true).toBe(false);
        }
        catch (err) {
            expect(JSON.stringify(err.stderr.toString('utf8'))).toContain("Error: No map features file was provided");
        }
    });
});
//# sourceMappingURL=uploadMapFeatures.spec.js.map