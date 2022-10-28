import ModalDialogue from "./modalDialogue.js";

export default class TileSetImportModalDialogue extends ModalDialogue {


    /** @type {HTMLTextAreaElement} */
    #tbTileSetData;
    /** @type {HTMLInputElement} */
    #tbReplaceTiles;
    /** @type {HTMLElement} */
    #element;


    /**
     * Initialises a new instance of the AddPaletteModalDialogue class.
     * @param {HTMLDivElement} element The DIV that contains the modal.
     */
    constructor(element) {
        super(element);
        this.#element = element;
        this.#tbTileSetData = this.#element.querySelector('[data-smsgfx-id=text-tile-data]');
        this.#tbReplaceTiles = this.#element.querySelector('[data-smsgfx-id=check-replace-tiles]');
    }


    /**
     * Sets the state of the tile set import dialogue.
     * @param {TileSetImportModalDialogueState} state - State object.
     */
    setState(state) {
        if (typeof state?.tileSetData === 'string') {
            this.#tbTileSetData.value = state.tileSetData;
        }
        if (typeof state?.replace === 'boolean' || typeof state?.replace === 'number') {
            this.#tbReplaceTiles.checked = state.replace;
        }
    }


    /**
     * @param {TileSetImportModalDialogueConfirmCallback} callback - Callback to use.
     */
    addHandlerOnConfirm(callback) {
        super.addHandlerOnConfirm(() => {
            callback({
                tileSetData: this.#tbTileSetData.value,
                replace: this.#tbReplaceTiles.checked
            });
        });
    }


}


/**
 * Import tile set dialogue state object.
 * @typedef {object} TileSetImportModalDialogueState
 * @property {string?} tileSetData - The WLA-DLX assembly code that contains the tiles.
 * @property {boolean?} replace - Should the 'replace tiles' checkbox be checked?
 */

/**
 * Import tile set dialogue confirm callback.
 * @callback TileSetImportModalDialogueConfirmCallback
 * @argument {TileSetImportModalDialogueConfirmEventArgs} data - Data from the dialogue.
 * @exports
 */
/**
 * Import tile set dialogue confirm args.
 * @typedef {object} TileSetImportModalDialogueConfirmEventArgs
 * @property {string} tileSetData - The WLA-DLX assembly code that contains the palette.
 * @property {boolean} replace - 'true' if existing tiles should be replaced, otherwise 'false'.
 * @exports
 */