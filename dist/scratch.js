"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RhinoSpect_Api_1 = require("./Classes/RhinoSpect.Api");
const apiSvc = new RhinoSpect_Api_1.ApiService("https://go.rhinospect.com/", "69667efb-2abd-46b1-be0e-21e20e8bb5b7");
const userId = "lance@rhinosw.com";
try {
    apiSvc.getModuleUser("95784261-7dc2-4ab7-91bd-c577a954fbd3", userId).then(moduleUser => {
        console.log(JSON.stringify(moduleUser, null, "\t"));
    })
        .catch(err => {
        console.log(err);
    });
}
catch (ex) {
    throw `There was a problem retrieving the user for '${userId}'\n${ex}`;
}
//# sourceMappingURL=scratch.js.map