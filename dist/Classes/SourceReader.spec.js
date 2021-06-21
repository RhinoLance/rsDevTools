"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SourceReader_1 = require("./SourceReader");
describe("SourceReader", () => {
    it("should throw an error for a bad file path", () => {
        const testPath = "../../non-existent-file.whoops";
        const sr = new SourceReader_1.SourceReader(testPath);
        try {
            sr.getSourceParts("noddy.comp");
            fail("Expected an Exception");
        }
        catch (ex) {
            if (!ex.message) {
                fail("Exected the exception to have a message property");
            }
            expect(true).toBe(true);
        }
    });
    it("should read the file", () => {
        const sr = new SourceReader_1.SourceReader("dummy");
        try {
            sr.getFileContents("Classes/SourceReader.spec.ts");
            expect(true).toBe(true);
        }
        catch (ex) {
            if (!ex.message) {
                fail("Exected the exception to have a message property");
            }
            fail(`The file was not found: ${ex.message}`);
        }
    });
});
//# sourceMappingURL=SourceReader.spec.js.map