import { Tile } from './tile.js';
import type { GameState, Position } from './types.js';
/**
 * Game Manager
 *
 * Singleton class that manages the game flow.
 */
export declare class GameManager {
    /** Grid Size */
    static size: number;
    /** Game State */
    static state: GameState;
    /** Start Tiles Count */
    static startTiles: number;
    constructor(size: number);
    /**
     * Restarts the game.
     */
    static restart(): void;
    /**
     * Keep playing after winning (allows going over 2048)
     */
    static keepPlaying(): void;
    /**
     * Returns true if the game is lost or ended.
     *
     * @returns Game Terminated Status
     */
    static isGameTerminated(): boolean;
    /**
     * Sets up the game.
     */
    static setup(): void;
    /**
     * Set up the starting tiles.
     */
    static addStartTiles(): void;
    /**
     * Adds a tile in a random position.
     */
    static addRandomTile(): void;
    /**
     * Sends the updated grid to the actuator.
     */
    static actuate(): void;
    /**
     * Saves all tile positions and removes merge info.
     */
    static prepareTiles(): void;
    /**
     * Moves a tile and its representation
     *
     * @param tile Tile to Move
     * @param cell Destination Cell
     */
    static moveTile(tile: Tile, cell: Position): void;
    /**
     * Moves tiles on the grid in the specified direction
     *
     * 0: up
     * 1: right
     * 2: down
     * 3: left
     *
     * @param direction Direction to Move
     */
    static move(direction: number): void;
    /**
     * Gets the vector representing the chosen direction.
     *
     * @param direction Direction
     */
    static getVector(direction: number): Position;
    /**
     * Builds a list of positions to traverse in the right order.
     *
     * @param vector Vector
     */
    static buildTraversals(vector: Position): {
        [key: string]: number[];
    };
    static findFarthestPosition(cell: Position, vector: Position): {
        farthest: Position;
        next: Position;
    };
    /**
     * Checks if moves are available.
     *
     * @returns Moves Available
     */
    static movesAvailable(): boolean;
    /**
     * Checks for available matches between tiles
     */
    static tileMatchesAvailable(): boolean;
    /**
     * Checks if the specified positions are equal.
     *
     * @param first First Position
     * @param second Second Position
     * @returns Position Equality
     */
    static positionsEqual(first: Position, second: Position): boolean;
}
