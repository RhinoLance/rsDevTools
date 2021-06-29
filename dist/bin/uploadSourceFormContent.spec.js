"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
describe("uploadSourceFormContent", () => {
    it("runScript_withoutUserId_shouldError", () => {
        try {
            const child = child_process_1.execFileSync("node", ["./dist/bin/uploadSourceFormContent"], { shell: true });
            expect(true).toBe(false);
        }
        catch (err) {
            expect(JSON.stringify(err.stderr.toString('utf8'))).toContain("error: missing required argument 'configFile'");
        }
    });
});
//# sourceMappingURL=uploadSourceFormContent.spec.js.map