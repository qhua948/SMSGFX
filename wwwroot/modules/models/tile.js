/**
 * Single 8x8 tile.
 */
export default class Tile {


    /** The length of the tile data. */
    get length() {
        return this.#data.length;
    }


    #data = new Uint8ClampedArray(64);


    /**
     * Clears the contents of the tile.
     */
    clear() {
        this.#data = new Uint8ClampedArray(64);
    }

    /**
     * Reads the entire tile data.
     * @returns {Uint8ClampedArray}
     */
    readAll() {
        return this.#data.slice(0);
    }

    /**
     * Reads a section of the tile data.
     * @param {number} start - Index to start reading from.
     * @param {number} end - Index to finish reading at.
     * @returns {Uint8ClampedArray}
     */
    readFrom(start, end) {
        if (start === null || end === null) throw new Error('Read start and/or end not specified.');
        if (start < 0 || start >= this.#data.length) throw new Error('Read start out of range.');
        if (end < 0 || end >= this.#data.length) throw new Error('Read end out of range.');
        if (start > end) throw new Error('Start is greater than end.');
        return this.#data.slice(start, end);
    }

    /**
     * Gets the palette index of a pixal at the given index.
     * @param {number} index - Index of the pixel to read.
     * @returns {number} Palette index of the pixel at the given index.
     */
    readAt(index) {
        if (index === null) throw new Error('Read index not specified.');
        return this.#data[index];
    }

    /**
     * Gets the palette index of a pixal at the given X and Y coordinate.
     * @param {number} x X coordinate to read from (0 to 7).
     * @param {number} y Y coordinate to read from (0 to 7).
     * @returns {number} Palette index of the pixel at the given coordinate.
     */
    readAtCoord(x, y) {
        if (x === null) throw new Error('X coordinate not specified.');
        if (x < 0 || x > 8) throw new Error('X coordinate must be between 0 and 8.');
        if (y === null) throw new Error('Y coordinate not specified.');
        if (y < 0 || y > 8) throw new Error('Y coordinate must be between 0 and 8.');
        return this.readAt(y * 8 + x);
    }

    /**
     * Sets the palette index of a pixel at the given index.
     * @param {number} index Index of the pixel to set.
     * @param {number} paletteIndex Palette index of the pixel to set.
     * @returns {boolean} true if the value was updated, otherwise false.
     */
    setValueAt(index, paletteIndex) {
        if (index === null) throw new Error('Read index not specified.');
        if (index < 0 || index > 63) throw new Error('Read index must be between 0 and 63.');
        if (paletteIndex < 0 || paletteIndex > 255) throw new Error('Value must be between 0 and 255.');
        if (this.#data[index] !== paletteIndex) {
            this.#data[index] = paletteIndex;
            return true;
        }
        return false;
    }

    /**
     * Sets the palette index of a pixel at the given X and Y coordinate.
     * @param {number} x X coordinate to read from (0 to 7).
     * @param {number} y Y coordinate to read from (0 to 7).
     * @param {number} value Palette index of the pixel to set.
     * @returns {boolean} true if the value was updated, otherwise false.
     */
    setValueAtCoord(x, y, value) {
        if (x === null) throw new Error('X coordinate not specified.');
        if (x < 0 || x > 8) throw new Error('X coordinate must be between 0 and 8.');
        if (y === null) throw new Error('Y coordinate not specified.');
        if (y < 0 || y > 8) throw new Error('Y coordinate must be between 0 and 8.');
        return this.setValueAt(y * 8 + x, value);
    }


    /**
     * Replaces all instaances of one colour index with another.
     * @param {number} sourceColourIndex - Colour index to replace, from 0 to 15.
     * @param {number} targetColourIndex - Colour index to set source to, from 0 to 15.
     */
    replaceColourIndex(sourceColourIndex, targetColourIndex) {
        if (typeof sourceColourIndex !== 'number') throw new Error('Invalid source colour index.');
        if (sourceColourIndex < 0 || sourceColourIndex > 15) throw new Error('Source colour index must be between 0 and 15.');
        if (typeof targetColourIndex !== 'number') throw new Error('Invalid target colour index.');
        if (targetColourIndex < 0 || targetColourIndex > 15) throw new Error('Target colour index must be between 0 and 15.');

        if (sourceColourIndex === targetColourIndex) return;

        const data = this.#data;
        for (let i = 0; i < data.length; i++) {
            if (data[i] === sourceColourIndex) {
                data[i] = targetColourIndex;
            }
        }
    }

    /**
     * Swaps all instaances of one colour index with another.
     * @param {number} firstColourIndex - First colour index to swap, from 0 to 15.
     * @param {number} secondColourIndex - Second colour index to swap, from 0 to 15.
     */
    swapColourIndex(firstColourIndex, secondColourIndex) {
        if (typeof firstColourIndex !== 'number') throw new Error('Invalid first colour index.');
        if (firstColourIndex < 0 || firstColourIndex > 15) throw new Error('First colour index must be between 0 and 15.');
        if (typeof secondColourIndex !== 'number') throw new Error('Invalid second colour index.');
        if (secondColourIndex < 0 || secondColourIndex > 15) throw new Error('Second colour index must be between 0 and 15.');

        if (firstColourIndex === secondColourIndex) return;

        const data = this.#data;
        for (let i = 0; i < data.length; i++) {
            if (data[i] === firstColourIndex) {
                data[i] = secondColourIndex;
            } else if (data[i] === secondColourIndex) {
                data[i] = firstColourIndex;
            }
        }
    }


}

