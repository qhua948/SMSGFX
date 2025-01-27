import EventDispatcher from "../components/eventDispatcher.js";
import TemplateUtil from "../util/templateUtil.js";

const EVENT_OnCommand = 'EVENT_OnCommand';

const commands = {
    cut: 'cut', copy: 'copy', paste: 'paste',
    clone: 'clone', remove: 'remove',
    moveLeft: 'moveLeft', moveRight: 'moveRight',
    mirrorHorizontal: 'mirrorHorizontal', mirrorVertical: 'mirrorVertical',
    insertBefore: 'insertBefore', insertAfter: 'insertAfter',
    brushSize: 'brushSize',
    referenceImageLockAspect: 'referenceImageLockAspect',
    referenceImageSelect: 'referenceImageSelect',
    referenceImageClear: 'referenceImageClear',
    referenceImageDisplay: 'referenceImageDisplay',
    referenceImageRevert: 'referenceImageRevert'
}
const toolstrips = {
    select: 'select', pencil: 'pencil', referenceImage: 'referenceImage'
}

export default class TileContextToolbar {


    static get Commands() {
        return commands;
    }

    static get Toolstrips() {
        return toolstrips;
    }


    /** @type {HTMLElement} */
    #element;
    /** @type {{HTMLButtonElement}} */
    #buttons = {};
    #dispatcher;
    #enabled = true;
    /** @type {DOMRect} */
    #lastBounds = null;


    /**
     * Initialises a new instance of this class.
     * @param {HTMLElement} element - Element that contains the DOM.
     */
    constructor(element) {
        this.#element = element;
        this.#dispatcher = new EventDispatcher();

        const buttonLinkReferenceAspect = this.#element.querySelector('button[data-toggle=referenceImageAspect]');

        this.#element.querySelectorAll('button[data-command]').forEach(button => {
            button.onclick = () => {
                const args = this.#createArgs(button);
                args.brushSize = parseInt(button.getAttribute('data-brush-size') ?? 0);
                this.#dispatcher.dispatch(EVENT_OnCommand, args);
            };
        });

        this.#element.querySelectorAll('input[data-command]').forEach(textbox => {
            textbox.onchange = () => {
                const args = this.#createArgs(textbox);
                this.#dispatcher.dispatch(EVENT_OnCommand, args);
            };
        });

        this.#element.querySelectorAll('select[data-command]').forEach(select => {
            select.onchange = () => {
                const args = this.#createArgs(select);
                this.#dispatcher.dispatch(EVENT_OnCommand, args);
            };
        });
    }


    /**
     * Creates an instance of the object inside a container element.
     * @param {HTMLElement} element - Container element.
     * @returns {Promise<TileContextToolbar>}
     */
     static async loadIntoAsync(element) {
        const componentElement = await TemplateUtil.replaceElementWithComponentAsync('tileContextToolbar', element);
        return new TileContextToolbar(componentElement);
    }


    /**
     * Sets the state of the tile context toolbar.
     * @param {TileContextToolbarState} state - State object.
     */
    setState(state) {
        if (typeof state?.visible === 'boolean') {
            // Set visibility
            if (state.visible) {
                while (this.#element.classList.contains('visually-hidden')) {
                    this.#element.classList.remove('visually-hidden');
                }
            } else {
                if (!this.#element.classList.contains('visually-hidden')) {
                    this.#element.classList.add('visually-hidden');
                }
            }
        }
        if (state?.disabledCommands && Array.isArray(state.disabledCommands)) {
            this.#element.querySelectorAll('[data-command]').forEach(button => {
                button.removeAttribute('disabled');
            });
            state.disabledCommands.forEach(disabledButton => {
                if (disabledButton && typeof disabledButton === 'string') {
                    if (this.#buttons[disabledButton]) {
                        this.#buttons[disabledButton].addAttribute('disabled', 'disabled');
                    }
                }
            });
        }
        if (typeof state?.brushSize === 'number') {
            this.#element.querySelectorAll(`[data-command=${commands.brushSize}]`).forEach(button => {
                button.classList.remove('active');
                const size = parseInt(button.getAttribute('data-brush-size'));
                if (size === state.brushSize) {
                    button.classList.add('active');
                }
            });
        }
        if (state?.visibleToolstrips && Array.isArray(state.visibleToolstrips)) {
            this.#element.querySelectorAll('[data-toolstrip]').forEach(element => {
                const toolstrip = element.getAttribute('data-toolstrip');
                if (state.visibleToolstrips.includes(toolstrip)) {
                    while (element.classList.contains('visually-hidden')) {
                        element.classList.remove('visually-hidden');
                    }
                } else {
                    element.classList.add('visually-hidden');
                }
            });
        }
        if (state.referenceBounds) {
            const b = state.referenceBounds;
            this.#element.querySelectorAll(`[data-command=${commands.referenceImageDisplay}][data-field]`).forEach(element => {
                switch (element.getAttribute('data-field')) {
                    case 'referenceX': element.value = Math.round(b.x); break;
                    case 'referenceY': element.value = Math.round(b.y); break;
                    case 'referenceWidth': element.value = Math.round(b.width); break;
                    case 'referenceHeight': element.value = Math.round(b.height); break;
                }
            });
            this.#lastBounds = b;
        }
        if (typeof state?.referenceLockAspect === 'boolean') {
            const element = this.#element.querySelector('button[data-toggle=referenceImageAspect]');
            if (state.referenceLockAspect) {
                if (element.classList.contains('active')) element.classList.add('active');
                element.setAttribute('aria-pressed', 'true');
            } else {
                while (element.classList.contains('active')) element.classList.remove('active');
                element.setAttribute('aria-pressed', 'false');
            }
        }
        if (typeof state?.referenceTransparency === 'number') {
            const element = this.#element.querySelector(`[data-command=${commands.referenceImageDisplay}][data-field=referenceTransparency]`);
            if (element) element.value = state.referenceTransparency;
        }

        if (typeof state?.enabled === 'boolean') {
            this.#enabled = state?.enabled;
            this.#element.querySelectorAll('[data-command]').forEach(element => {
                element.disabled = !this.#enabled;
            });
        }
    }


    /**
     * Register a callback for when a command button is clicked on the tile context toolbar.
     * @param {TileContextToolbarCommandCallback} callback - Callback that will receive the command.
     */
    addHandlerOnCommand(callback) {
        this.#dispatcher.on(EVENT_OnCommand, callback);
    }


    /**
     * @param {HTMLElement} element 
     * @returns {TileContextToolbarCommandEventArgs}
     */
    #createArgs(element) {
        const referenceBounds = new DOMRect(
            parseInt(this.#element.querySelector('[data-field=referenceX]')?.value ?? 0),
            parseInt(this.#element.querySelector('[data-field=referenceY]')?.value ?? 0),
            parseInt(this.#element.querySelector('[data-field=referenceWidth]')?.value ?? 0),
            parseInt(this.#element.querySelector('[data-field=referenceHeight]')?.value ?? 0)
        );
        const buttonLinkReferenceAspect = this.#element.querySelector('button[data-toggle=referenceImageAspect]');

        if (this.#lastBounds) {
            if (isToggled(buttonLinkReferenceAspect)) {
                const field = element.getAttribute('data-field');
                if (field === 'referenceWidth') {
                    const percent = 1 / this.#lastBounds.width * referenceBounds.width;
                    referenceBounds.height = Math.round(this.#lastBounds.height * percent);
                } else if (field === 'referenceHeight') {
                    const percent = 1 / this.#lastBounds.height * referenceBounds.height;
                    referenceBounds.width = Math.round(this.#lastBounds.width * percent);
                }
            }
        }

        /** @type {TileContextToolbarCommandEventArgs} */
        return {
            command: element.getAttribute('data-command') ?? null,
            brushSize: 0,
            referenceBounds: referenceBounds,
            referenceLockAspect: isToggled(buttonLinkReferenceAspect),
            referenceTransparency: parseInt(this.#element.querySelector('[data-field=referenceTransparency]')?.value ?? 0)
        };
    }


}

/**
 * @param {HTMLElement} element
 * @returns {Boolean}
 */
function isToggled(element) {
    return element?.classList.contains('active') ?? false;
}


/**
 * @typedef {object} TileContextToolbarState
 * @property {boolean?} visible - Is the toolbar visible?
 * @property {boolean?} enabled - Is the toolbar enabled?
 * @property {string[]?} visibleToolstrips - An array of strings containing visible toolstrips.
 * @property {string[]?} disabledCommands - An array of strings containing disabled buttons.
 * @property {number?} brushSize - Selected brush size, 1 to 5.
 * @property {DOMRect?} referenceBounds - Bounds for the reference image.
 * @property {boolean?} referenceLockAspect - Whether or not to lock the aspect ratio for the reference image.
 * @property {number?} referenceTransparency - Transparency colour for the reference image.
 * @exports
 */

/**
 * Callback for when a command is invoked.
 * @callback TileContextToolbarCommandCallback
 * @param {TileContextToolbarCommandEventArgs} args - Arguments.
 * @exports
 */
/**
 * @typedef {object} TileContextToolbarCommandEventArgs
 * @property {string} command - Command being invoked.
 * @property {number} brushSize - Brush size, 1 to 5.
 * @property {DOMRect} referenceBounds - Bounds for the reference image.
 * @property {boolean} referenceLockAspect - Whether or not to lock the aspect ratio for the reference image.
 * @property {number} referenceTransparency - Colour index to draw transparent.
 * @exports
 */

