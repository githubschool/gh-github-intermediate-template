import type { Position } from './types.js';
/** Tile */
export declare class Tile {
    /** Tile Merged From */
    mergedFrom: Tile[] | null;
    /** Tile Position */
    position: Position;
    /** Tile Previous Position */
    previousPosition: Position | null;
    /** Tile Value */
    value: number;
    /**
     * Creates a Tile instance.
     *
     * @param position Tile Starting Position
     * @param value Tile Starting Value (Default: 2)
     */
    constructor(position: Position, value?: number);
    /**
     * Saves the current position of the tile.
     */
    savePosition(): void;
    /**
     * Updates the position of the tile.
     *
     * @param position New Position
     */
    updatePosition(position: Position): void;
}
