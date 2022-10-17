import PersistentUIStateFactory from "../factory/persistentUIStateFactory.js";
import PersistentUIState from "../models/persistentUIState.js";

export default class PersistentUIStateJsonSerialiser {


    /**
     * Serialises the class.
     * @param {PersistentUIState} appUI - The app UI object to serialise.
     * @returns {string}
     */
     static serialise(appUI) {
        /** @type {PersistentUISerialisable} */
        const result = {
            importPaletteAssemblyCode: appUI.importPaletteAssemblyCode,
            importPaletteSystem: appUI.importPaletteSystem,
            importTileAssemblyCode: appUI.importTileAssemblyCode,
            paletteIndex: appUI.paletteIndex,
            scale: appUI.scale,
            displayNativeColour: appUI.displayNativeColour
        };
        return JSON.stringify(result);
    }

    /**
     * Deserialises a JSON string into an AppUI object.
     * @param {string} value JSON string.
     * @returns {PersistentUIState}
     */
    static deserialise(value) {
        const result = PersistentUIStateFactory.create();
        /** @type {PersistentUISerialisable} */
        const deserialised = JSON.parse(value);
        if (deserialised) {
            if (deserialised.importPaletteAssemblyCode) {
                result.importPaletteAssemblyCode = deserialised.importPaletteAssemblyCode;
            }
            if (deserialised.importPaletteSystem) {
                result.importPaletteSystem = deserialised.importPaletteSystem;
            }
            if (deserialised.importTileAssemblyCode) {
                result.importTileAssemblyCode = deserialised.importTileAssemblyCode;
            }
            if (deserialised.paletteIndex) {
                result.paletteIndex = deserialised.paletteIndex;
            }
            if (deserialised.scale) {
                result.scale = deserialised.scale;
            }
            if (typeof deserialised.displayNativeColour === 'boolean') {
                result.displayNativeColour = deserialised.displayNativeColour;
            } 
        }
        return result;
    }


}

/**
 * @typedef PersistentUISerialisable
 * @type {object}
 * @property {string} importPaletteAssemblyCode
 * @property {string} importPaletteSystem
 * @property {string} importTileAssemblyCode
 * @property {number} paletteIndex
 * @property {number} scale
 * @property {boolean} displayNativeColour
 */
