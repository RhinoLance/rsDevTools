import { AppState } from "../providers/AppState.service";

let AppStateDefault: AppState.IRecord = {
    activeTab: 0,
    activeFilter: null,
    map: {
        gpsActive: true,
        zoom: 13,
        center: [-42.8821, 147.3272],
        layerVisibility: []
        }
}
    
export {AppStateDefault};