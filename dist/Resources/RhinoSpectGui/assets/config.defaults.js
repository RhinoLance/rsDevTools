"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigDefault = void 0;
let ConfigDefault = {
    server: {
        version: 1.0,
        lastModified: 0,
        adminPassword: "",
        media: {
            downloadMaxEdge: 600,
            captureMaxEdge: 1200,
            captureQuality: 90,
            saveToAlbum: true
        },
        gpsDef: {
            timeout: 5000,
            accuracyTarget: 20,
            accuracyWorst: 100,
            searchRadius: 30000
        },
        sync: {
            autoSyncFrequency: 10000
        },
        icons: {
            defaultSrc: "marker_sq_blue",
        },
        map: {
            defaultTileLayer: {
                name: "Basemap",
                url: "https://cartodb-basemaps-c.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png",
                type: "L.TileLayer",
                visible: true,
                opacity: 1,
                typeOptions: {
                    attribution: "OpenStreetMap contributors",
                    maxZoom: 22,
                    name: "Basemap",
                    cacheActions: 255
                }
            }
        }
    },
    client: {
        mockCordova: true,
        serverConfig: {
            url: "https://go.rhinospect.com/",
            config: "default"
        },
        inspectionListView: 1,
        mediaSyncType: 1,
        autoSync: true
    }
};
exports.ConfigDefault = ConfigDefault;
//# sourceMappingURL=config.defaults.js.map