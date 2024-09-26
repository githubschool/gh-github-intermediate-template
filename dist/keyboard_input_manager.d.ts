/**
 * Keyboard Input Manager
 *
 * Singleton class that manages keyboard inputs.
 */
export declare class KeyboardInputManager {
    /** Events */
    static events: {
        [key: string]: any[];
    };
    constructor();
    /**
     * Adds an event listener.
     *
     * @param event Event
     * @param callback Callback
     */
    static on(event: string, callback: any): void;
    /**
     * Emits an event to all listeners.
     *
     * @param event Event
     * @param data Data
     */
    static emit(event: string, data?: any): void;
    /**
     * Listens for events.
     */
    static listen(): void;
    /**
     * Emits a restart event.
     *
     * @param event Event
     */
    static restart(event: Event): void;
    /**
     * Emits a keep playing event.
     *
     * @param event Event
     */
    static keepPlaying(event: Event): void;
    /**
     * Binds a button press.
     *
     * @param selector Selector
     */
    static bindButtonPress(selector: any, fn: any): void;
}
