import type { Tile } from './tile.js';
import type { GameState, Position } from './types.js';
/**
 * HTML Actuator
 *
 * Singleton class that manages HTML updates.
 */
export declare class HTMLActuator {
    /** Best Score Container */
    static bestContainer: Element;
    /** Message Container */
    static messageContainer: Element;
    /** Score */
    static score: number;
    /** Score Container */
    static scoreContainer: Element;
    /** Tile Container */
    static tileContainer: Element;
    constructor();
    /**
     * Updates the UI based on game state changes.
     *
     * @param metadata Game Metadata
     */
    static actuate(metadata: GameState): void;
    /**
     * Continues the game.
     *
     * Affects both restarts and keep playing.
     */
    static continueGame(): void;
    /**
     * Clears the tile container.
     *
     * @param container Container
     */
    static clearContainer(container: Element): void;
    /**
     * Adds a tile.
     *
     * @param tile Tile
     */
    static addTile(tile: Tile): void;
    /**
     * Applies classes to an element.
     *
     * @param element Element to Apply Classes
     * @param classes Classes to Apply
     */
    static applyClasses(element: any, classes: string[]): void;
    /**
     * Normalizes the position.
     *
     * @param position Position
     * @returns Normalized Position
     */
    static normalizePosition(position: Position): Position;
    /**
     * Creates a class name for a position.
     *
     * @param position Position
     * @returns Class Name
     */
    static positionClass(position: Position): string;
    /**
     * Updates the Score
     *
     * @param score Score
     */
    static updateScore(score: number): void;
    /**
     * Updates the best score.
     *
     * @param bestScore Best Score
     */
    static updateBestScore(bestScore: number): void;
    /**
     * Sets the message.
     *
     * @param won Won Status
     */
    static message(won: boolean): void;
    /**
     * Clears the message.
     */
    static clearMessage(): void;
}
