import { EventBus } from 'ts-event-bus'
import { getLogger } from 'log4js'
const logger = getLogger('EventBusInternal')

export const eventBus = new EventBus()

eventBus.registerPublicEvent = (event) => {
  if (event !== 'ALLPUBLIC') { eventBus.onRaw(event, eventhandler) }
}
function eventhandler (event) {
  eventBus.emit('ALLPUBLIC', event)
}
eventBus.on('catch-error', function (err) {
  logger.warn(err)
})
