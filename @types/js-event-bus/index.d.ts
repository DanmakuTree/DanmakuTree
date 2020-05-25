// Type definitions for 'js-event-bus'
/**
 * EventName
 * 
 * You can use wildcards ( `*` and `**`) to register listeners using a specific pattern.
 */
type EventName = string

declare interface EventBus {
    /**
     * Register to an event
     * @param event the name of the event ;
     * @param callback 
     */
    on(event:EventName,callback:(...args: any)=>{}):void;

    /**
     * Register only one time to an event
     * @param event the name of the event ;
     * @param callback 
     */
    once(event:EventName,callback:(...args: any)=>{}):void;

    /**
     * Register several time to an event
     * @param times 
     * @param event the name of the event ;
     * @param callback 
     */
    exactly(times:number,event:EventName,callback:(...args: any)=>{}):void;
    
    /**
     * Emit an event
     * You can emit an event by calling the `emit` function. 
     * @param event the name of the event ;
     */
    emit(event:EventName):void;
        /**
     * Emit an event
     * You can emit an event by calling the `emit` function. 
     * @param event the name of the event ;
     * @param context the context with which it will be fired ;
     * @param args ... all the arguments.
     */
    emit(event:EventName,context:any,...args: any):void;

    /**
     * Detach an event for the callback
     * @param event the name of the event ;
     * @param callback 
     */
    detach(event:EventName,callback:(...args: any)=>{}):void;

    /**
     * Detach an event for all the callbacks that have been set before
     * @param event the name of the event ;
     */
    detach(event:EventName):void;

    /**
     * Detach all the events created in the event bus
     */
    detachAll():void;

    /**
     * Detach all the callbacks for this event. any of them won't be executed anymore.
     * @param event the name of the event
     * 
     * Note that `off` is an alias of `die`.
     */
    off(event:EventName):void;
    
    /**
     * Detach all the callbacks for this event. any of them won't be executed anymore.
     * @param event the name of the event
     */
    die(event:EventName):void;
}

declare module 'js-event-bus'{
    export = ():EventBus=>{}
}