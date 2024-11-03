#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const chalk_1 = require("chalk");
const fs = require("fs");
const path = require("path");
const ModuleProcessor_1 = require("../Classes/ModuleProcessor");
const SourceReader_1 = require("../Classes/SourceReader");
const FilePatcher_1 = require("../Classes/FilePatcher");
let _configFile = "./rhinospect.conf.json";
const emojis = {
    happy: "🙂",
    skull: "☠️",
    fire: "🔥",
    curvy: "〰️",
    whiteCircle: "⚪",
    wait: ""
};
var program = new commander_1.Command("patchModule [configFile]")
    .version("1.0.0")
    .arguments('[configFile]')
    .action((configFile) => {
    _configFile = configFile || _configFile;
})
    .option("-c --config <string>", "Specify the configuration to run.  If not specified it will use the default configuration.")
    .parse(process.argv);
try {
    main(program, _configFile);
}
catch (error) {
    fatal(error + "\n");
    process.exit(1);
}
function action(message) {
    console.log(emojis.wait + " " + chalk_1.default.white(message));
}
function success(message) {
    console.log(emojis.happy + " " + chalk_1.default.greenBright(message));
}
function error(message) {
    console.error(emojis.fire + " " + chalk_1.default.redBright(message));
}
function fatal(message) {
    console.error(emojis.skull + " " + chalk_1.default.redBright(message));
    process.exit(1);
}
function main(program, configPath) {
    const options = program.opts();
    const config = getConfig(configPath, options.config);
    const processor = new ModuleProcessor_1.ModuleProcessor(config);
    const promiseList = [];
    try {
        if (config.moduleAttributes) {
            promiseList.push(patchModule(config.moduleAttributes, processor));
            console.log("");
        }
        if (config.classMap) {
            promiseList.push(...patchClasses(config, processor));
            console.log("");
        }
    }
    catch (ex) {
        if (ex instanceof Error) {
            fatal(ex.message);
        }
        else {
            console.log('Unexpected error', ex);
        }
    }
    Promise.all(promiseList)
        .then(result => {
        success(`Module patched successfully`);
        action(`Pushing module to server: ${config.serverName}`);
        return processor.pushModuleToServer();
    })
        .then(result => {
        success(`Module succesfully saved to server`);
    })
        .catch(ex => error("Error: " + ex));
}
function getConfig(configPath, configName) {
    let jsonPath;
    if (configPath) {
        jsonPath = configPath;
    }
    else {
        jsonPath = path.join(__dirname, '..', 'rhinospect.conf.json');
    }
    let config;
    try {
        var jsonString = fs.readFileSync(jsonPath, 'utf8');
        var configFileObj = JSON.parse(jsonString);
        config = configFileObj.publishConfigurationList.find(v => v.name == (configName !== null && configName !== void 0 ? configName : "default"));
    }
    catch (ex) {
        const errorMessage = (ex instanceof Error) ? ex.message : ex;
        fatal(`There was an error reading the configuration file.  Please ensure that you either specify a file path, or have a rhinospect.conf.json in your project's root folder.  Error: ${errorMessage}`);
    }
    if (!config) {
        throw (`The specified config section could not be found, or there is no default configuration.\nUnable to find "${(configName !== null && configName !== void 0 ? configName : "default")}" in "${path.resolve(jsonPath)}"`);
    }
    return config;
}
function patchClasses(config, processor) {
    const promiseList = [];
    config.classMap.map(v => {
        const reader = new SourceReader_1.SourceReader();
        if (v.templateFilePath == undefined) {
            throw Error("No templateFilePath found in the config.");
        }
        if (v.patchList == undefined) {
            throw Error("No patchList found in the config.");
        }
        action(`Loading template file for ${v.className}`);
        const patcher = new FilePatcher_1.FilePatcher(v.templateFilePath);
        v.patchList.map(p => {
            action(`Loading patch file for ${p.key}`);
            patcher.applyPatch(p);
            success(`Patch successfull for ${p.key}`);
        });
        success(`All class patches applied`);
        const patchedTemplate = patcher.patchedContent;
        fs.writeFileSync(`./patched-${v.className}.json`, patchedTemplate);
        action(`Checking that the patched template is valid JSON`);
        const templateObj = JSON.parse(patchedTemplate);
        success(`Template is valid JSON`);
        action(`Retrieving module from server, and patching ${v.className} class`);
        //Ensure that the relevant properties are strings
        if (typeof templateObj.icon !== "string")
            templateObj.icon = JSON.stringify(templateObj.icon);
        if (typeof templateObj.source.css !== "string")
            templateObj.source.css = JSON.stringify(templateObj.source.css);
        if (typeof templateObj.source.html !== "string")
            templateObj.source.html = JSON.stringify(templateObj.source.html);
        if (typeof templateObj.source.javascript !== "string")
            templateObj.source.javascript = JSON.stringify(templateObj.source.javascript);
        promiseList.push(processor.patchClass(v, templateObj));
    });
    return promiseList;
}
function patchModule(config, processor) {
    if (config.templateFilePath == undefined) {
        throw Error("No module templateFilePath found in the config.");
    }
    if (config.patchList == undefined) {
        throw Error("No module patchList found in the config.");
    }
    action(`Loading template file for module attributes`);
    const patcher = new FilePatcher_1.FilePatcher(config.templateFilePath);
    config.patchList.map(p => {
        action(`Loading patch file for ${p.key}`);
        patcher.applyPatch(p);
        success(`Patch successfull for ${p.key}`);
    });
    success(`All module attribute patches applied`);
    const patchedTemplate = patcher.patchedContent;
    fs.writeFileSync(`./patched-module`, patchedTemplate);
    action(`Checking that the patched template is valid JSON`);
    const templateObj = JSON.parse(patchedTemplate);
    success(`Template is valid JSON`);
    //Ensure that the relevant properties are strings
    if (typeof templateObj.mapFeatures !== "string")
        templateObj.mapFeatures = JSON.stringify(templateObj.mapFeatures);
    if (typeof templateObj.applets !== "string")
        templateObj.applets = JSON.stringify(templateObj.applets);
    return processor.patchModule(templateObj);
}
//# sourceMappingURL=patchModule.js.map