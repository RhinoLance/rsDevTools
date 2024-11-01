#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const chalk_1 = require("chalk");
const fs = require("fs");
const path = require("path");
const ModuleProcessor_1 = require("../Classes/ModuleProcessor");
const SourceReader_1 = require("../Classes/SourceReader");
let _configFile = "123";
const emojis = {
    happy: "🙂",
    skull: "☠️",
    fire: "🔥",
    curvy: "〰️",
    whiteCircle: "⚪",
    wait: ""
};
var program = new commander_1.Command("uploadSourceFormContent <configFile>")
    .version("1.0.0")
    .arguments('[configFile]')
    .action((configFile) => {
    _configFile = configFile;
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
    config.classMap.map(v => {
        action(`Reading local source files for ${v.componentName}`);
        const reader = new SourceReader_1.SourceReader(v.sourceFolder);
        try {
            const parts = reader.getSourceParts(v.componentName);
            const template = v.templateFilePath ? JSON.parse(reader.getFileContents(v.templateFilePath)) : undefined;
            success(`Source ready`);
            action(`Retrieving module from server, and updating ${v.className} class`);
            promiseList.push(processor.updateClass(v, parts, template));
        }
        catch (ex) {
            error(`${(ex instanceof Error) ? ex.message : ex}`);
        }
    });
    Promise.all(promiseList)
        .then(result => {
        success(`Update successfull`);
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
        fatal(`There was an error reading the configuration file.  Please ensure that you either specify a file path, or have a rhinospect.conf.json in your project's root folder.  Error: ${(ex instanceof Error) ? ex.message : ex}`);
    }
    if (!config) {
        throw (`The specified config section could not be found, or there is no default configuration.\nUnable to find "${(configName !== null && configName !== void 0 ? configName : "default")}" in "${path.resolve(jsonPath)}"`);
    }
    return config;
}
//# sourceMappingURL=uploadSourceFormContent.js.map