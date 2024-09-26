const animFramePolyfill = () => {
    let lastTime = 0;
    const vendors = ['webkit', 'moz'];
    for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[`${vendors[x]}RequestAnimationFrame`];
        window.cancelAnimationFrame =
            window[`${vendors[x]}CancelAnimationFrame`] ||
                window[`${vendors[x]}CancelRequestAnimationFrame`];
    }
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function (callback) {
            const currTime = new Date().getTime();
            const timeToCall = Math.max(0, 16 - (currTime - lastTime));
            const id = window.setTimeout(function () {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
    }
};

/** Tile */
class Tile {
    /** Tile Merged From */
    mergedFrom = null;
    /** Tile Position */
    position;
    /** Tile Previous Position */
    previousPosition = null;
    /** Tile Value */
    value;
    /**
     * Creates a Tile instance.
     *
     * @param position Tile Starting Position
     * @param value Tile Starting Value (Default: 2)
     */
    constructor(position, value) {
        this.position = position;
        this.value = value || 2;
    }
    /**
     * Saves the current position of the tile.
     */
    savePosition() {
        this.previousPosition = this.position;
    }
    /**
     * Updates the position of the tile.
     *
     * @param position New Position
     */
    updatePosition(position) {
        this.position = position;
    }
}

/**
 * Grid
 *
 * Singleton class that manages the game grid.
 */
class Grid {
    /** Size */
    static size = 4;
    /** Cells */
    static cells;
    constructor(size, previousState) {
        Grid.size = size;
        if (previousState)
            Grid.fromState(previousState);
        else
            Grid.empty();
    }
    /**
     * Empties the grid of tiles.
     */
    static empty() {
        Grid.cells = [];
        for (let x = 0; x < Grid.size; x++) {
            Grid.cells[x] = [];
            for (let y = 0; y < Grid.size; y++)
                Grid.cells[x].push(null);
        }
    }
    /**
     * Sets the grid from the saved state.
     *
     * @param state State
     */
    static fromState(state) {
        Grid.cells = [];
        for (let x = 0; x < Grid.size; x++) {
            Grid.cells[x] = [];
            for (let y = 0; y < Grid.size; y++) {
                const tile = state[x][y];
                Grid.cells[x].push(tile ? new Tile(tile.position, tile.value) : null);
            }
        }
    }
    /**
     * Finds the first available random position.
     *
     * @returns Random Available Position
     */
    static randomAvailableCell() {
        const cells = Grid.availableCells();
        return cells.length > 0
            ? cells[Math.floor(Math.random() * cells.length)]
            : null;
    }
    /**
     * Gets the available cells as positions.
     *
     * @returns Available Cells as Positions
     */
    static availableCells() {
        const cells = [];
        Grid.eachCell(function (position, tile) {
            if (tile === null)
                cells.push(position);
        });
        return cells;
    }
    /**
     * Calls a callback function for every cell.
     *
     * @param callback Callback function
     */
    static eachCell(callback) {
        for (let x = 0; x < Grid.size; x++)
            for (let y = 0; y < Grid.size; y++)
                callback({ x, y }, Grid.cells[x][y]);
    }
    /**
     * Checks if there are any available positions.
     *
     * @returns Available Position Status
     */
    static cellsAvailable() {
        return Grid.availableCells().length > 0;
    }
    /**
     * Checks if the specified cell is available.
     *
     * @param cell Cell
     * @returns Available Cell Status
     */
    static cellAvailable(cell) {
        return !Grid.cellOccupied(cell);
    }
    /**
     * Checks if the specified cell is occupied.
     *
     * @param cell Cell
     * @returns Occupied Cell Status
     */
    static cellOccupied(cell) {
        return !!Grid.cellContent(cell);
    }
    /**
     * Gets the content of the specified cell.
     *
     * @param cell Cell
     * @returns Cell Content
     */
    static cellContent(cell) {
        return Grid.withinBounds(cell) ? Grid.cells[cell.x][cell.y] : null;
    }
    /**
     * Inserts a tile at a specific position.
     *
     * @param tile Tile
     */
    static insertTile(tile) {
        Grid.cells[tile.position.x][tile.position.y] = tile;
    }
    /**
     * Removes a tile from the grid.
     *
     * @param tile Tile
     */
    static removeTile(tile) {
        Grid.cells[tile.position.x][tile.position.y] = null;
    }
    /**
     * Checks if the specified position is within the grid.
     *
     * @param position Position
     * @returns Position Status
     */
    static withinBounds(position) {
        return (position.x >= 0 &&
            position.x < Grid.size &&
            position.y >= 0 &&
            position.y < Grid.size);
    }
}

/**
 * HTML Actuator
 *
 * Singleton class that manages HTML updates.
 */
class HTMLActuator {
    /** Best Score Container */
    static bestContainer = document.querySelector('.best-container');
    /** Message Container */
    static messageContainer = document.querySelector('.game-message');
    /** Score */
    static score = 0;
    /** Score Container */
    static scoreContainer = document.querySelector('.score-container');
    /** Tile Container */
    static tileContainer = document.querySelector('.tile-container');
    constructor() { }
    /**
     * Updates the UI based on game state changes.
     *
     * @param metadata Game Metadata
     */
    static actuate(metadata) {
        window.requestAnimationFrame(function () {
            HTMLActuator.clearContainer(HTMLActuator.tileContainer);
            Grid.cells.forEach(function (column) {
                column.forEach(function (cell) {
                    if (cell)
                        HTMLActuator.addTile(cell);
                });
            });
            HTMLActuator.updateScore(metadata.score);
            HTMLActuator.updateBestScore(metadata.bestScore);
            if (metadata.terminated && metadata.gameOver)
                HTMLActuator.message(false);
            else if (metadata.terminated && metadata.won)
                HTMLActuator.message(true);
        });
    }
    /**
     * Continues the game.
     *
     * Affects both restarts and keep playing.
     */
    static continueGame() {
        HTMLActuator.clearMessage();
    }
    /**
     * Clears the tile container.
     *
     * @param container Container
     */
    static clearContainer(container) {
        while (container.firstChild)
            container.removeChild(container.firstChild);
    }
    /**
     * Adds a tile.
     *
     * @param tile Tile
     */
    static addTile(tile) {
        const wrapper = document.createElement('div');
        const inner = document.createElement('div');
        const position = tile.previousPosition || tile.position;
        const positionClass = HTMLActuator.positionClass(position);
        const classes = ['tile', `tile-${tile.value}`, positionClass];
        if (tile.value > 2048)
            classes.push('tile-super');
        HTMLActuator.applyClasses(wrapper, classes);
        inner.classList.add('tile-inner');
        inner.textContent = tile.value.toString();
        if (tile.previousPosition) {
            // Make sure that the tile gets rendered in the previous position first
            window.requestAnimationFrame(function () {
                classes[2] = HTMLActuator.positionClass(tile.position);
                HTMLActuator.applyClasses(wrapper, classes);
            });
        }
        else if (tile.mergedFrom) {
            classes.push('tile-merged');
            HTMLActuator.applyClasses(wrapper, classes);
            // Render the tiles that merged
            tile.mergedFrom.forEach(function (merged) {
                HTMLActuator.addTile(merged);
            });
        }
        else {
            classes.push('tile-new');
            HTMLActuator.applyClasses(wrapper, classes);
        }
        // Add the inner part of the tile to the wrapper
        wrapper.appendChild(inner);
        // Put the tile on the board
        HTMLActuator.tileContainer.appendChild(wrapper);
    }
    /**
     * Applies classes to an element.
     *
     * @param element Element to Apply Classes
     * @param classes Classes to Apply
     */
    static applyClasses(element, classes) {
        element.setAttribute('class', classes.join(' '));
    }
    /**
     * Normalizes the position.
     *
     * @param position Position
     * @returns Normalized Position
     */
    static normalizePosition(position) {
        return { x: position.x + 1, y: position.y + 1 };
    }
    /**
     * Creates a class name for a position.
     *
     * @param position Position
     * @returns Class Name
     */
    static positionClass(position) {
        position = HTMLActuator.normalizePosition(position);
        return `tile-position-${position.x}-${position.y}`;
    }
    /**
     * Updates the Score
     *
     * @param score Score
     */
    static updateScore(score) {
        HTMLActuator.clearContainer(HTMLActuator.scoreContainer);
        const difference = score - HTMLActuator.score;
        HTMLActuator.score = score;
        HTMLActuator.scoreContainer.textContent = HTMLActuator.score.toString();
        if (difference > 0) {
            const addition = document.createElement('div');
            addition.classList.add('score-addition');
            addition.textContent = '+' + difference;
            HTMLActuator.scoreContainer.appendChild(addition);
        }
    }
    /**
     * Updates the best score.
     *
     * @param bestScore Best Score
     */
    static updateBestScore(bestScore) {
        HTMLActuator.bestContainer.textContent = bestScore.toString();
    }
    /**
     * Sets the message.
     *
     * @param won Won Status
     */
    static message(won) {
        HTMLActuator.messageContainer.classList.add(won ? 'game-won' : 'game-over');
        HTMLActuator.messageContainer.getElementsByTagName('p')[0].textContent = won
            ? 'You win!'
            : 'Game over!';
    }
    /**
     * Clears the message.
     */
    static clearMessage() {
        HTMLActuator.messageContainer.classList.remove('game-won');
        HTMLActuator.messageContainer.classList.remove('game-over');
    }
}

/**
 * Keyboard Input Manager
 *
 * Singleton class that manages keyboard inputs.
 */
class KeyboardInputManager {
    /** Events */
    static events = {};
    constructor() {
        KeyboardInputManager.events = {};
        KeyboardInputManager.listen();
    }
    /**
     * Adds an event listener.
     *
     * @param event Event
     * @param callback Callback
     */
    static on(event, callback) {
        if (!KeyboardInputManager.events[event])
            KeyboardInputManager.events[event] = [];
        KeyboardInputManager.events[event].push(callback);
    }
    /**
     * Emits an event to all listeners.
     *
     * @param event Event
     * @param data Data
     */
    static emit(event, data) {
        if (KeyboardInputManager.events[event])
            for (const callback of KeyboardInputManager.events[event])
                callback(data);
    }
    /**
     * Listens for events.
     */
    static listen() {
        const map = {
            ArrowUp: 0,
            ArrowRight: 1,
            ArrowDown: 2,
            ArrowLeft: 3,
            w: 0, // Up
            a: 3, // Left
            s: 2, // Down
            d: 1 // Right
        };
        // Respond to direction keys.
        document.addEventListener('keydown', function (event) {
            // Ignore the event if it includes a modifier key.
            if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)
                return;
            const mappedKey = map[event.key];
            if (mappedKey !== undefined) {
                event.preventDefault();
                KeyboardInputManager.emit('move', mappedKey);
            }
            // R key restarts the game.
            if (event.key === 'r') {
                event.preventDefault();
                KeyboardInputManager.restart(event);
            }
        });
        // Respond to button presses.
        KeyboardInputManager.bindButtonPress('.restart-button', KeyboardInputManager.restart);
        KeyboardInputManager.bindButtonPress('.retry-button', KeyboardInputManager.restart);
        KeyboardInputManager.bindButtonPress('.keep-playing-button', KeyboardInputManager.keepPlaying);
    }
    /**
     * Emits a restart event.
     *
     * @param event Event
     */
    static restart(event) {
        event.preventDefault();
        KeyboardInputManager.emit('restart');
    }
    /**
     * Emits a keep playing event.
     *
     * @param event Event
     */
    static keepPlaying(event) {
        event.preventDefault();
        KeyboardInputManager.emit('keepPlaying');
    }
    /**
     * Binds a button press.
     *
     * @param selector Selector
     */
    static bindButtonPress(selector, fn) {
        const button = document.querySelector(selector);
        button.addEventListener('click', fn.bind(KeyboardInputManager));
    }
}

/**
 * Local Storage Manager
 *
 * Singleton class that manages the local storage.
 */
class LocalStorageManager {
    /** Storage */
    static storage = window.localStorage;
    constructor() { }
    /**
     * Gets the best score.
     *
     * @returns Best Score
     */
    static getBestScore() {
        return parseInt(LocalStorageManager.storage.getItem('bestScore') || '0', 10);
    }
    /**
     * Sets the best score.
     *
     * @param score Best Score
     */
    static setBestScore(score) {
        LocalStorageManager.storage.setItem('bestScore', score.toString());
    }
    /**
     * Gets the game state.
     *
     * @returns Game State
     */
    static getGameState() {
        const gameState = LocalStorageManager.storage.getItem('gameState');
        return gameState !== null
            ? JSON.parse(LocalStorageManager.storage.getItem('gameState'))
            : null;
    }
    /**
     * Sets the game state.
     *
     * @param gameState Game State
     */
    static setGameState(gameState) {
        LocalStorageManager.storage.setItem('gameState', JSON.stringify({
            ...gameState,
            grid: {
                size: gameState.grid.size,
                cells: gameState.grid.cells
            }
        }));
    }
    /**
     * Clears the game state.
     *
     * All values are set to their original defaults.
     */
    static clearGameState() {
        LocalStorageManager.storage.removeItem('gameState');
    }
}

/**
 * Game Manager
 *
 * Singleton class that manages the game flow.
 */
class GameManager {
    /** Grid Size */
    static size;
    /** Game State */
    static state;
    /** Start Tiles Count */
    static startTiles = 2;
    constructor(size) {
        GameManager.size = size;
        new KeyboardInputManager();
        KeyboardInputManager.on('move', GameManager.move.bind(GameManager));
        KeyboardInputManager.on('restart', GameManager.restart.bind(GameManager));
        KeyboardInputManager.on('keepPlaying', GameManager.keepPlaying.bind(GameManager));
        GameManager.setup();
    }
    /**
     * Restarts the game.
     */
    static restart() {
        LocalStorageManager.clearGameState();
        HTMLActuator.continueGame();
        GameManager.setup();
    }
    /**
     * Keep playing after winning (allows going over 2048)
     */
    static keepPlaying() {
        GameManager.state.keepPlaying = true;
        HTMLActuator.continueGame();
    }
    /**
     * Returns true if the game is lost or ended.
     *
     * @returns Game Terminated Status
     */
    static isGameTerminated() {
        return (GameManager.state.gameOver ||
            (GameManager.state.won && !GameManager.state.keepPlaying));
    }
    /**
     * Sets up the game.
     */
    static setup() {
        const previousState = LocalStorageManager.getGameState();
        if (previousState !== null) {
            // Reload previous state.
            new Grid(previousState.grid.size, previousState.grid.cells);
            GameManager.state = {
                bestScore: previousState.bestScore,
                gameOver: previousState.gameOver,
                grid: previousState.grid,
                keepPlaying: previousState.keepPlaying,
                score: previousState.score,
                terminated: previousState.terminated,
                won: previousState.won
            };
        }
        else {
            // Create a new game state.
            new Grid(GameManager.size);
            GameManager.state = {
                bestScore: 0,
                gameOver: false,
                grid: Grid,
                keepPlaying: false,
                score: 0,
                terminated: false,
                won: false
            };
            // Add the initial tiles
            GameManager.addStartTiles();
        }
        // Update the actuator
        GameManager.actuate();
    }
    /**
     * Set up the starting tiles.
     */
    static addStartTiles() {
        for (let i = 0; i < GameManager.startTiles; i++)
            GameManager.addRandomTile();
    }
    /**
     * Adds a tile in a random position.
     */
    static addRandomTile() {
        if (Grid.cellsAvailable()) {
            const value = Math.random() < 0.9 ? 2 : 4;
            const cell = Grid.randomAvailableCell();
            if (cell !== null)
                Grid.insertTile(new Tile(cell, value));
        }
    }
    /**
     * Sends the updated grid to the actuator.
     */
    static actuate() {
        if (LocalStorageManager.getBestScore() < GameManager.state.score)
            LocalStorageManager.setBestScore(GameManager.state.score);
        // Clear the state when the game is over (game over only, not won)
        if (GameManager.state.gameOver)
            LocalStorageManager.clearGameState();
        else
            LocalStorageManager.setGameState(GameManager.state);
        HTMLActuator.actuate({
            ...GameManager.state,
            bestScore: LocalStorageManager.getBestScore(),
            terminated: GameManager.isGameTerminated()
        });
        // Save the game state.
        GameManager.state.grid = Grid;
        LocalStorageManager.setGameState(GameManager.state);
    }
    /**
     * Saves all tile positions and removes merge info.
     */
    static prepareTiles() {
        Grid.eachCell(function (position, tile) {
            if (tile) {
                tile.mergedFrom = null;
                tile.savePosition();
            }
        });
    }
    /**
     * Moves a tile and its representation
     *
     * @param tile Tile to Move
     * @param cell Destination Cell
     */
    static moveTile(tile, cell) {
        Grid.cells[tile.position.x][tile.position.y] = null;
        Grid.cells[cell.x][cell.y] = tile;
        tile.updatePosition(cell);
    }
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
    static move(direction) {
        // Don't do anything if the game is over
        if (GameManager.isGameTerminated())
            return;
        let cell, tile;
        let moved = false;
        const vector = GameManager.getVector(direction);
        const traversals = GameManager.buildTraversals(vector);
        // Save the current tile positions and remove merge information
        GameManager.prepareTiles();
        // Traverse the grid in the right direction and move tiles
        traversals.x.forEach(function (x) {
            traversals.y.forEach(function (y) {
                cell = { x, y };
                tile = Grid.cellContent(cell);
                if (tile !== null) {
                    const positions = GameManager.findFarthestPosition(cell, vector);
                    const next = Grid.cellContent(positions.next);
                    // Only one merger per row traversal
                    if (next && next.value === tile.value && !next.mergedFrom) {
                        const merged = new Tile(positions.next, tile.value * 2);
                        merged.mergedFrom = [tile, next];
                        Grid.insertTile(merged);
                        Grid.removeTile(tile);
                        // Converge the two tiles' positions
                        tile.updatePosition(positions.next);
                        // Update the score
                        GameManager.state.score += merged.value;
                        // GameManager.state.grid = Grid
                        // The mighty 2048 tile
                        if (merged.value === 2048)
                            GameManager.state.won = true;
                    }
                    else
                        GameManager.moveTile(tile, positions.farthest);
                    // The tile moved from its original cell!
                    if (!GameManager.positionsEqual(cell, tile.position))
                        moved = true;
                }
            });
        });
        if (moved) {
            GameManager.addRandomTile();
            if (!GameManager.movesAvailable())
                GameManager.state.gameOver = true;
            GameManager.actuate();
        }
    }
    /**
     * Gets the vector representing the chosen direction.
     *
     * @param direction Direction
     */
    static getVector(direction) {
        // Vectors representing tile movement
        const map = {
            0: { x: 0, y: -1 }, // Up
            1: { x: 1, y: 0 }, // Right
            2: { x: 0, y: 1 }, // Down
            3: { x: -1, y: 0 } // Left
        };
        return map[direction];
    }
    /**
     * Builds a list of positions to traverse in the right order.
     *
     * @param vector Vector
     */
    static buildTraversals(vector) {
        const traversals = { x: [], y: [] };
        for (let pos = 0; pos < GameManager.size; pos++) {
            traversals.x.push(pos);
            traversals.y.push(pos);
        }
        // Always traverse from the farthest cell in the chosen direction
        if (vector.x === 1)
            traversals.x = traversals.x.reverse();
        if (vector.y === 1)
            traversals.y = traversals.y.reverse();
        return traversals;
    }
    static findFarthestPosition(cell, vector) {
        let farthest;
        // Progress towards the vector direction until an obstacle is found
        do {
            farthest = cell;
            cell = { x: farthest.x + vector.x, y: farthest.y + vector.y };
        } while (Grid.withinBounds(cell) && Grid.cellAvailable(cell));
        return {
            farthest, // The farthest position this tile can move to
            next: cell // Used to check if a merge is required
        };
    }
    /**
     * Checks if moves are available.
     *
     * @returns Moves Available
     */
    static movesAvailable() {
        return Grid.cellsAvailable() || GameManager.tileMatchesAvailable();
    }
    /**
     * Checks for available matches between tiles
     */
    static tileMatchesAvailable() {
        let tile;
        for (let x = 0; x < GameManager.size; x++) {
            for (let y = 0; y < GameManager.size; y++) {
                tile = Grid.cellContent({ x, y });
                if (tile !== null) {
                    for (let direction = 0; direction < 4; direction++) {
                        const vector = GameManager.getVector(direction);
                        const cell = { x: x + vector.x, y: y + vector.y };
                        const other = Grid.cellContent(cell);
                        if (other && other.value === tile.value) {
                            return true; // These two tiles can be merged
                        }
                    }
                }
            }
        }
        return false;
    }
    /**
     * Checks if the specified positions are equal.
     *
     * @param first First Position
     * @param second Second Position
     * @returns Position Equality
     */
    static positionsEqual(first, second) {
        return first.x === second.x && first.y === second.y;
    }
}

window.requestAnimationFrame(function () {
    animFramePolyfill();
    // Initialize the game
    new GameManager(4);
});
//# sourceMappingURL=application.js.map
