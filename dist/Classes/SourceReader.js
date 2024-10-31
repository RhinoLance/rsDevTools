"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SourceReader = void 0;
const fs = require("fs");
const path = require("path");
class SourceReader {
    constructor(folderPath) {
        this.srcRoot = "folderPath";
        this.srcRoot = folderPath;
    }
    getSourceParts(componentName) {
        const output = {};
        const srcPath = path.resolve(this.srcRoot, `${componentName}-formReady`);
        output.css = this.getFileContents(`${srcPath}.css`);
        output.html = this.getFileContents(`${srcPath}.html`);
        output.javascript = this.getFileContents(`${srcPath}.js`);
        return output;
    }
    getFileContents(filePath) {
        try {
            return fs.readFileSync(filePath, 'utf8');
        }
        catch (ex) {
            const fullPath = path.resolve(filePath);
            const message = `Could not read file at "${fullPath}"`;
            throw Error(message);
        }
    }
}
exports.SourceReader = SourceReader;
//# sourceMappingURL=SourceReader.js.map