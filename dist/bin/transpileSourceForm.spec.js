"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const fs = require("fs");
describe("transpileSourceForm", () => {
    it("runScript_withoutTargetFile_shouldError", () => {
        try {
            const child = (0, child_process_1.execFileSync)("node", ["./dist/bin/transpileSourceForm"], { shell: true });
            expect(true).toBe(false);
        }
        catch (err) {
            expect(JSON.stringify(err.stderr.toString('utf8'))).toContain("error: missing required argument 'targetFile'");
        }
    });
    it("runScript_withAllArgs_shouldComplete", () => {
        const srcPath = "./testResources/transpileSource.ts";
        const targetPath = "./testResources/transpileSource-formReady.js";
        const version = Math.random().toString(36).slice(-5);
        try {
            const child = (0, child_process_1.execFileSync)("node", ["./dist/bin/transpileSourceForm", srcPath, version], { shell: true });
        }
        catch (err) {
            expect(JSON.stringify(err?.stderr?.toString('utf8'))).toBe("Empty");
        }
        const output = fs.readFileSync(targetPath, 'utf8');
        expect(output.substr(0, 20)).toBe(`/* Version: ${version} */`);
    });
});
//# sourceMappingURL=transpileSourceForm.spec.js.map