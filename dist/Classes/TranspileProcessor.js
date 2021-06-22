"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranspileProcessor = void 0;
const path = require("path");
const ts = require("typescript");
const sass = require("sass");
class TranspileProcessor {
    constructor() { }
    processHtml(source, version) {
        return this.insertVersion(source, "html", version);
    }
    processScss(source, version) {
        let css;
        try {
            css = sass.renderSync({ data: source }).css.toString();
        }
        catch (ex) {
            throw (`There was an error transpiling ${path.basename(source, ".scss")}.  ${ex}`);
        }
        css = this.insertVersion(css, "css", version);
        return css;
    }
    processTs(source, version) {
        const start = source.search(/export class/) + 7;
        let truncated = source.substring(start);
        truncated = this.cleanImportStatements(truncated);
        let transpiled;
        try {
            transpiled = ts.transpileModule(truncated, { compilerOptions: {
                    module: ts.ModuleKind.ES2015,
                    target: ts.ScriptTarget.ES2016
                }
            }).outputText;
        }
        catch (ex) {
            throw (`There was an error transpiling typescript ${path.basename(source, ".ts")}.  ${ex}`);
        }
        transpiled = this.cleanExportClassStatements(transpiled);
        transpiled = this.cleanEmptyExportStatements(transpiled);
        transpiled = this.insertVersion(transpiled, "js", version);
        return transpiled;
    }
    cleanImportStatements(tsSrc) {
        return tsSrc.replace(/^import.*$;/g, "");
    }
    cleanExportClassStatements(jsSrc) {
        return jsSrc.replace(/export class/g, "class");
    }
    cleanEmptyExportStatements(jsSrc) {
        return jsSrc.replace(/export {};/g, "");
    }
    insertVersion(template, fileType, version) {
        if (!version) {
            return template;
        }
        let comment = "";
        switch (fileType) {
            case "html":
                comment = "<!-- Version: VERSION_PLACEHOLDER -->";
                break;
            case "css":
            case "js":
            case "ts":
                comment = "/* Version: VERSION_PLACEHOLDER */";
        }
        let output = comment + "\n\n" + template;
        output = output.replace(/VERSION_PLACEHOLDER/g, `${version}`);
        return output;
    }
}
exports.TranspileProcessor = TranspileProcessor;
//# sourceMappingURL=TranspileProcessor.js.map