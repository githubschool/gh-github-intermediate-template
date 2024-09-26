import type { GameState } from './types.js';
/**
 * Local Storage Manager
 *
 * Singleton class that manages the local storage.
 */
export declare class LocalStorageManager {
    /** Storage */
    static storage: Storage;
    constructor();
    /**
     * Gets the best score.
     *
     * @returns Best Score
     */
    static getBestScore(): number;
    /**
     * Sets the best score.
     *
     * @param score Best Score
     */
    static setBestScore(score: number): void;
    /**
     * Gets the game state.
     *
     * @returns Game State
     */
    static getGameState(): GameState | null;
    /**
     * Sets the game state.
     *
     * @param gameState Game State
     */
    static setGameState(gameState: GameState): void;
    /**
     * Clears the game state.
     *
     * All values are set to their original defaults.
     */
    static clearGameState(): void;
}
