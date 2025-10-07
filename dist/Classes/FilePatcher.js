"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilePatcher = void 0;
const SourceReader_1 = require("./SourceReader");
class FilePatcher {
    _templatePath;
    get patchedContent() {
        return this._patchedContent;
    }
    _patchedContent = "";
    _sourceReader = new SourceReader_1.SourceReader();
    constructor(_templatePath) {
        this._templatePath = _templatePath;
        this._patchedContent = this._sourceReader.getFileContents(_templatePath);
    }
    applyPatch(patch) {
        if (patch.filePath != undefined) {
            this.patchWithFile(patch);
        }
        else if (patch.replaceWithValue != undefined) {
            this.patchWithValue(patch);
        }
    }
    patchWithValue(patch) {
        this._patchedContent = this._patchedContent.replaceAll(patch.key, patch.replaceWithValue);
    }
    patchWithFile(patch) {
        let patchFile = this._sourceReader.getFileContents(patch.filePath);
        if (patch.stringify === true) {
            patchFile = JSON.stringify(patchFile);
        }
        if (patch.strippedStringify === true) {
            const patchString = JSON.stringify(patchFile);
            const stripped = patchString.substring(1, patchString.length - 1);
            patchFile = stripped;
        }
        this._patchedContent = this._patchedContent.replaceAll(patch.key, patchFile);
    }
}
exports.FilePatcher = FilePatcher;
//# sourceMappingURL=FilePatcher.js.map