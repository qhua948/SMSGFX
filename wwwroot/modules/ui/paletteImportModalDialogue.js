import ModalDialogue from "./modalDialogue.js";
import TemplateUtil from "../util/templateUtil.js";

export default class PaletteModalDialogue extends ModalDialogue {


    /** @type {HTMLSelectElement} */
    #tbPaletteSystem;
    /** @type {HTMLTextAreaElement} */
    #tbPaletteData;
    /** @type {HTMLElement} */
    #element;


    /**
     * Initialises a new instance of this class.
     * @param {HTMLElement} element - Element that contains the DOM.
     */
    constructor(element) {
        super(element);
        this.#element = element;
        this.#tbPaletteSystem = this.#element.querySelector('[data-smsgfx-id=select-palette-system]');
        this.#tbPaletteData = this.#element.querySelector('[data-smsgfx-id=text-palette-data]');
    }


    /**
     * Creates an instance of the object inside a container element.
     * @param {HTMLElement} element - Container element.
     * @returns {Promise<PaletteModalDialogue>}
     */
     static async loadIntoAsync(element) {
        const componentElement = await TemplateUtil.replaceElementWithComponentAsync('paletteImportModalDialogue', element);
        return new PaletteModalDialogue(componentElement);
    }


    /**
     * Sets the state of the palette import dialogue.
     * @param {PaletteImportModalDialogueState} state - State object.
     */
    setState(state) {
        if (typeof state?.system === 'string') {
            this.#tbPaletteSystem.value = state.system;
        }
        if (typeof state?.paletteData === 'string') {
            this.#tbPaletteData.value = state.paletteData;
        }
    }


    /**
     * Adds an event handler for when the user confirms the palette modal dialogue.
     * @param {PaletteImportModalDialogueConfirmCallback} callback - Callback function.
     */
    addHandlerOnConfirm(callback) {
        super.addHandlerOnConfirm(() => {
            callback({
                system: this.#tbPaletteSystem.value,
                paletteData: this.#tbPaletteData.value
            });
        });
    }


}


/**
 * Import tile set dialogue state object.
 * @typedef {object} PaletteImportModalDialogueState
 * @property {string} system - The system to be imported, either 'ms' or 'gg'.
 * @property {string} paletteData - The WLA-DLX assembly code that contains the palette.
 */

/**
 * Import palette dialogue confirm callback.
 * @callback PaletteImportModalDialogueConfirmCallback
 * @argument {PaletteImportModalDialogueConfirmEventArgs} data - Data from the dialogue.
 * @exports
 */
/**
 * Import palette dialogue confirm args.
 * @typedef {object} PaletteImportModalDialogueConfirmEventArgs
 * @property {string} system - The system to be imported, either 'ms' or 'gg'.
 * @property {string} paletteData - The WLA-DLX assembly code that contains the palette.
 * @exports
 */