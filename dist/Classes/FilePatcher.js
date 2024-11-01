"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilePatcher = void 0;
const SourceReader_1 = require("./SourceReader");
class FilePatcher {
    constructor(_templatePath) {
        this._templatePath = _templatePath;
        this._patchedContent = "";
        this._sourceReader = new SourceReader_1.SourceReader();
        this._patchedContent = this._sourceReader.getFileContents(_templatePath);
    }
    get patchedContent() {
        return this._patchedContent;
    }
    applyPatch(patch) {
        let patchFile = this._sourceReader.getFileContents(patch.filePath);
        if (patch.stringify === true) {
            patchFile = JSON.stringify(patchFile);
        }
        this._patchedContent = this._patchedContent.replace(patch.key, patchFile);
    }
}
exports.FilePatcher = FilePatcher;
//# sourceMappingURL=FilePatcher.js.map