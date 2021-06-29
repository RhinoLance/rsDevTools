#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const chalk_1 = require("chalk");
const fs = require("fs");
const path = require("path");
const RhinoSpect_Api_1 = require("../Classes/RhinoSpect.Api");
const PermissionProcessor_1 = require("../Classes/PermissionProcessor");
let _configFile;
const emojis = {
    happy: "🙂",
    skull: "☠️",
    fire: "🔥"
};
var program = new commander_1.Command("setPermissions <configFile>")
    .version("1.0.0")
    .argument('<configFile>', "path to the RhinoSpect config file.")
    .action((configFile) => {
    _configFile = configFile;
})
    .option("-c --config <string>", "Specify the configuration to run.  If not specified it will use the default configuration.")
    .requiredOption("-u --user <string>", "Specify the UserId to update.")
    .option("-n --note <string>", "Specify a note to be saved with the user permission.")
    .option("--read", "Add read permission.")
    .option("--no-read", "Remove read permission.")
    .option("--write", "Add write permission.")
    .option("--no-write", "Remove write permission.")
    .option("--moduleEdit", "Add moduleEdit permission.")
    .option("--no-moduleEdit", "Remove moduleEdit permission.")
    .option("--security", "Add security permission.")
    .option("--no-security", "Remove security permission.")
    .option("--assignTo", "Add assignTo permission.")
    .option("--no-assignTo", "Remove assignTo permission.")
    .option("--restrictToAssignedTo", "Add restrictToAssignedTo permission.")
    .option("--no-restrictToAssignedTo", "Remove restrictToAssignedTo permission.")
    .parse(process.argv);
main(program, _configFile)
    .catch(error => {
    fatal(error + "\n");
    process.exit(1);
});
function success(message) {
    console.log(emojis.happy + " " + chalk_1.default.greenBright(message));
}
function error(message) {
    console.error(emojis.fire + " " + chalk_1.default.redBright(message));
}
function fatal(message) {
    console.error(emojis.skull + " " + chalk_1.default.redBright(message));
    process.stderr.write(emojis.skull + " " + chalk_1.default.redBright(message));
    process.exit(1);
}
async function main(program, configPath) {
    const options = program.opts();
    const config = getConfig(configPath, options.config);
    const permissions = options;
    const userIdArg = options.user;
    const apiSvc = new RhinoSpect_Api_1.ApiService(config.url, config.token);
    const processor = new PermissionProcessor_1.PermissionProcessor();
    let userId;
    let moduleUser;
    try {
        userId = userIdArg.indexOf("@") == -1 ? userIdArg : (await apiSvc.getUser(userIdArg)).userId;
        moduleUser = await apiSvc.getModuleUser(config.moduleId, userId);
    }
    catch (ex) {
        throw `There was a problem retrieving the user for '${userIdArg}'\n${ex}`;
    }
    moduleUser.permissions = processor.calculatePermissions(moduleUser.permissions, permissions);
    console.log(`Options: ${JSON.stringify(options)}`);
    if (options.note) {
        moduleUser.description = options.note;
    }
    try {
        console.log(`ModuleUser: ${JSON.stringify(moduleUser)}`);
        await apiSvc.setModuleUser(moduleUser);
    }
    catch (ex) {
        throw `There was a problem saving the module permissions for '${userId}' on module '${config.name}'\n${ex}`;
    }
    success(`Module succesfully saved to server: ${config.name}`);
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
        fatal(`There was an error reading the configuration file.  Please ensure that you either specify a file path, or have a rhinospect.conf.json in your project's root folder.  Error: ${ex.message}`);
    }
    if (!config) {
        throw (`The specified config could not be found, or there is no default configuration.\nAttempted to load config from "${jsonPath}"`);
    }
    return config;
}
function readFile(filePath) {
    let data;
    try {
        data = fs.readFileSync(filePath, 'utf8');
    }
    catch (ex) {
        throw (`The specified source file could not be found at ${path.resolve(filePath)}`);
    }
    return data;
}
//# sourceMappingURL=setPermissions.js.map