import { EventBus } from 'ts-event-bus'

export const eventBus = new EventBus()

eventBus.registerPublicEvent = (event) => {
  if (event !== 'ALLPUBLIC') { eventBus.onRaw(event, eventhandler) }
}
function eventhandler (event) {
  eventBus.emit('ALLPUBLIC', event)
}
