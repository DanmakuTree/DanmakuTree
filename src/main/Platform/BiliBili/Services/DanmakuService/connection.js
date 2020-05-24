import 'ws'
import { EventEmitter } from 'events'

export class Connection extends EventEmitter {
  constructor (roomId) {
    super()
    this.roomId = roomId
    this.connection = null
  }
}
