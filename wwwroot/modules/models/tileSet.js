import TileFactory from './../factory/tileFactory.js';
import Tile from './tile.js';

/**
 * Set of tiles.
 */
export default class TileSet {


    /**
     * The amount of tiles in this tile set.
     */
    get length() {
        return this.#tiles.length;
    }

    /**
     * The width of the tile map (in 8x8 pixel tiles).
     */
    get tileWidth() {
        return this.#tileWidth;
    }
    set tileWidth(value) {
        if (value < 0) throw new Error('Tile width must be greater than 0.');
        this.#tileWidth = value;
        this.#calculateTotalRows();
    }

    /**
     * Gets the calculated tile height of the tile map.
     */
    get tileHeight() {
        return Math.ceil(this.length / this.tileWidth);
    }

    /**
     * Gets the total amount of pixels in the tile set.
     */
    get totalPx() {
        return this.#totalPx;
    }


    /** @type {Tile[]} */
    #tiles = [];
    #tileWidth = 1;
    #pxPerRow = 8;
    #totalRows = 0;
    #heightPx = 0;
    #totalPx = 0;
    /** @type {number} */
    #readIndex = 0;
    /** @type {Tile} */
    #readTile = null;


    /** Initialises a new instance of the tile set class. */
    constructor() {
    }


    #calculateTotalRows() {
        if (this.length > 0) {
            this.#totalRows = Math.ceil(this.tileWidth / this.length);
            this.#heightPx = this.#totalRows * 8;
            this.#totalPx = this.#pxPerRow * this.#totalRows;
        } else {
            this.#totalRows = 0;
            this.#heightPx = 0;
            this.#totalPx = 0;
        }
        this.#pxPerRow = this.length * 8;
    }

    /**
     * Adds a tile to the tile map.
     * @param {Tile} tile The tile to add.
     */
    addTile(tile) {
        if (!tile) throw new Error('Tile can not be null.');
        this.#tiles.push(tile);
        this.#calculateTotalRows();
    }

    /**
     * Inserts a tile at the given index.
     * @param {Tile} tile The tile to insert.
     * @param {number} index Index in the tile map where the tile should reside.
     */
    insertTileAt(tile, index) {
        if (!tile) throw new Error('Tile can not be null.');
        if (index < 0 || index > this.#tiles.length) throw new Error('Index must be between 0 and tile map count.');
        this.#tiles.splice(index, 0, tile);
        this.#calculateTotalRows();
    }

    /**
     * Removes a tile from the tile map.
     * @param {number} index Index in the tile map where the tile should be removed.
     */
    removeTile(index) {
        if (index < 0 || index > this.#tiles.length) throw new Error('Index must be between 0 and tile map count.');
        this.#tiles.splice(index, 1);
        this.#calculateTotalRows();
    }

    /**
     * Gets a tile from the tile map.
     * @param {number} index Index in the tile map of the tile to get.
     * @returns {Tile} Tile found at the given index.
     */
    getTile(index) {
        if (index < 0 || index > this.#tiles.length) throw new Error(`getTile: Index must be between 0 and tile map count, tiles: ${this.#tiles.length}, index: ${index}.`);
        return this.#tiles[index];
    }

    /**
     * Gets all tiles.
     * @returns {Tile[]}
     */
    getTiles() {
        return this.#tiles;
    }

    /**
     * Sets the coordinate to read from.
     * @param {number} x X coordinate in the tile set.
     * @param {number} y Y coordinate in the tile set.
     */
    setReadCoordinate(x, y) {
        if (!(x >= 1 && x <= this.#pxPerRow)) throw new Error(`X coordinate must be between 1 and ${this.#pxPerRow}.`);
        if (!(y >= 1 && y <= this.#heightPx)) throw new Error(`Y coordinate must be between 1 and ${this.#heightPx}.`);

        this.#readTile = this.getTileByCoordinate(x, y);
    }

    /**
     * Sets the next pixel index to read in the overall tile map.
     * @param {number} index Pixel index.
     */
    setReadIndex(index) {
        if (index < 0 || index >= this.#totalRows * 64) throw new Error(`Index was out of range, between 0 and ${(this.#totalRows * 64)}.`);
        this.#readIndex = index;
    }

    #setReadTile() {
        // If the current tile 
        if (this.#readIndex >= this.#totalPx) {
            this.#readTile = null;
        } else if (this.#readTile === null) {
            this.#readTile = this.getTileByPixelIndex(this.#readIndex);
        } else if (this.#readIndex % 8 === 0) {
            this.#readTile = this.getTileByPixelIndex(this.#readIndex);
        }
    }

    /**
     * Reads the next pixel value or returns null when at the end of the stream.
     * @returns {number|null}
     */
    readNextPixel() {
        this.#setReadTile();
        // Now return the next pixel
        if (this.#readTile !== null) {
            const y = Math.ceil(index / this.#pxPerRow);
            const x = index - y;
            const tileY = y % 8;
            const tileX = x % 8;
            const readPixel = tileY * 8 + tileX;
            // Move to next pixel
            this.#readIndex++;
            // Return pixel value
            return this.#readTile.readAt(readPixel);
        } else {
            return null;
        }
    }

    /**
     * Reads the next pixel value or returns null when at the end of the stream.
     * @returns {Uint8ClampedArray}
     */
    readPixels(count) {

        let leftToRead = Math.min(count, this.#totalPx - this.#readIndex);
        let resultIndex = 0;
        const result = new Uint8ClampedArray(leftToRead);

        while (leftToRead > 0) {

            const y = Math.ceil(index / this.#pxPerRow);
            const x = index - y + 1;
            const tileIndex = ((y - 1 % 8) * 8) + (x - 1 % 8);
            const tileRowLeft = 8 - (tileIndex % 8);

            this.#setReadTile();

            if (this.#readTile !== null) {
                const pxData = this.#readTile.readFrom(tileIndex, tileIndex + tileRowLeft);
                result.set(pxData, pxData.length);
            }

            resultIndex += tileRowLeft;
            this.leftToRead -= tileRowLeft;
            this.#readIndex += tileRowLeft;
        }

        return result;
    }

    /**
     * Gets the tile at a given X and Y coordinate, or null if out of range.
     * @param {number} x - X coordinate in the tile set.
     * @param {number} y - Y coordinate in the tile set.
     * @returns {number?}
     */
    getTileIndexByCoordinate(x, y) {
        const numAcrossXAxis = (x - (x % 8)) / 8;
        const numAcrossYAxis = (y - (y % 8)) / 8;
        const tileIndex = (numAcrossYAxis * this.#tileWidth) + numAcrossXAxis;

        if (tileIndex >= 0 && tileIndex < this.length) {
            return tileIndex;
        } else {
            return null;
        }
    }

    /**
     * Gets a tile that corresponds with a given X and Y coordinate, null if out of range.
     * @param {number} x - X coordinate in the tile set.
     * @param {number} y - Y coordinate in the tile set.
     * @returns {Tile?}
     */
    getTileByCoordinate(x, y) {
        const tileIndex = this.getTileIndexByCoordinate(x, y);
        if (tileIndex !== null) {
            return this.getTile(tileIndex);
        } else {
            return null;
        }
    }

    /**
     * Returns the tile associated with a given pixel index from top left.
     * @param {number} index Pixel from top left.
     * @returns {Tile}
     */
    getTileByPixelIndex(index) {
        const y = Math.ceil(index / this.#pxPerRow);
        const x = index - y;
        return this.getTileByCoordinate(x, y);
    }

    /**
     * Gets the tile index or null if not in the list.
     * @param {Tile} tile Tile to return the index of.
     * @returns {number|null}
     */
    getTileIndex(tile) {
        for (let i = 0; i < this.length; i++) {
            if (this.#tiles[i] === tile) return i;
        }
        return null;
    }

    /**
     * Gets the pixel value at the given coordinate.
     * @param {number} x X coordinate in the tile set.
     * @param {number} y Y coordinate in the tile set.
     * @returns {number|null}
     */
    getPixelAt(x, y) {
        if (x < 0 || x > this.tileWidth * 8 - 1) return;
        if (y < 0 || y > this.tileHeight * 8 - 1) return;

        // Get the tile number
        const tileX = (x - (x % 8)) / 8;
        const tileY = (y - (y % 8)) / 8;
        const tileNum = (tileY * this.tileWidth) + tileX;

        if (tileNum >= this.length) return null;

        // Work out the coordinates and byte number within the tile itself
        x = x % 8;
        y = y % 8;
        const byteNum = (y * 8) + x;

        return this.getTile(tileNum).readAt(byteNum);
    }

    /**
     * Sets the palette slot of a pixel at a given coordinate on the tile set.
     * @param {number} x X coordinate.
     * @param {number} y Y coordinate.
     * @param {number} paletteIndex Palette index of the colour, 0 to 15.
     * @returns {boolean} true if the value was updated, otherwise false.
     */
    setPixelAt(x, y, paletteIndex) {
        if (paletteIndex < 0 || paletteIndex > 15) throw new Error('setPixelAt: Palette index must be between 0 and 15.');

        if (x < 0 || x > this.tileWidth * 8 - 1) return;
        if (y < 0 || y > this.tileHeight * 8 - 1) return;

        // Get the tile number
        const tileX = (x - (x % 8)) / 8;
        const tileY = (y - (y % 8)) / 8;
        const tileNum = (tileY * this.tileWidth) + tileX;

        if (tileNum >= this.length) return;

        // Work out the coordinates and byte number within the tile itself
        x = x % 8;
        y = y % 8;
        const byteNum = (y * 8) + x;

        return this.getTile(tileNum).setValueAt(byteNum, paletteIndex);
    }

    /** Clears the tile set. */
    clear() {
        this.#tiles = [];
        this.#calculateTotalRows();
    }


    /**
     * Replaces all instaances of one colour index with another.
     * @param {number} sourceColourIndex - Colour index to replace, from 0 to 15.
     * @param {number} targetColourIndex - Colour index to set source to, from 0 to 15.
     */
    replaceColourIndex(sourceColourIndex, targetColourIndex) {
        for (let i = 0; i < this.#tiles.length; i++) {
            this.#tiles[i].replaceColourIndex(sourceColourIndex, targetColourIndex);
        }
    }

    /**
     * Swaps all instaances of one colour index with another.
     * @param {number} firstColourIndex - First colour index to swap, from 0 to 15.
     * @param {number} secondColourIndex - Second colour index to swap, from 0 to 15.
     */
    swapColourIndex(firstColourIndex, secondColourIndex) {
        for (let i = 0; i < this.#tiles.length; i++) {
            this.#tiles[i].swapColourIndex(firstColourIndex, secondColourIndex);
        }
    }


}
