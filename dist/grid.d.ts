import { Tile } from './tile.js';
import { GameState, Position } from './types.js';
/**
 * Grid
 *
 * Singleton class that manages the game grid.
 */
export declare class Grid {
    /** Size */
    static size: number;
    /** Cells */
    static cells: (Tile | null)[][];
    constructor(size: number, previousState?: GameState['grid']['cells']);
    /**
     * Empties the grid of tiles.
     */
    static empty(): void;
    /**
     * Sets the grid from the saved state.
     *
     * @param state State
     */
    static fromState(state: GameState['grid']['cells']): void;
    /**
     * Finds the first available random position.
     *
     * @returns Random Available Position
     */
    static randomAvailableCell(): Position | null;
    /**
     * Gets the available cells as positions.
     *
     * @returns Available Cells as Positions
     */
    static availableCells(): Position[];
    /**
     * Calls a callback function for every cell.
     *
     * @param callback Callback function
     */
    static eachCell(callback: any): void;
    /**
     * Checks if there are any available positions.
     *
     * @returns Available Position Status
     */
    static cellsAvailable(): boolean;
    /**
     * Checks if the specified cell is available.
     *
     * @param cell Cell
     * @returns Available Cell Status
     */
    static cellAvailable(cell: Position): boolean;
    /**
     * Checks if the specified cell is occupied.
     *
     * @param cell Cell
     * @returns Occupied Cell Status
     */
    static cellOccupied(cell: Position): boolean;
    /**
     * Gets the content of the specified cell.
     *
     * @param cell Cell
     * @returns Cell Content
     */
    static cellContent(cell: Position): Tile | null;
    /**
     * Inserts a tile at a specific position.
     *
     * @param tile Tile
     */
    static insertTile(tile: Tile): void;
    /**
     * Removes a tile from the grid.
     *
     * @param tile Tile
     */
    static removeTile(tile: Tile): void;
    /**
     * Checks if the specified position is within the grid.
     *
     * @param position Position
     * @returns Position Status
     */
    static withinBounds(position: Position): boolean;
}
