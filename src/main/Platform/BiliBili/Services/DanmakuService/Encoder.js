/**
 * @typedef {(package:any,rawdata:Buffer)=>Number} NeedCalcNumber
 */
/**
 * @typedef {{name:string,type:string,offset:(Number|NeedCalcNumber),length:(Number|NeedCalcNumber),default:(any|NeedCalcNumber)}} protocolItem
 */
/**
 * @type {Array<protocolItem>}
 */

var DefaultConfig = [
  { name: 'headerLength', type: 'UInt16', offset: 4, length: 2, default: 16 },
  { name: 'protocolVersion', type: 'UInt16', offset: 6, length: 2, default: 1 },
  { name: 'operation', type: 'UInt32', offset: 8, length: 4, default: 0 },
  { name: 'sequenceId', type: 'UInt32', offset: 12, length: 4, default: 2 },
  {
    name: 'body',
    type: 'Buffer',
    offset (result, packet) {
      return packet.headerLength // packet.headerLength.length
    },
    length (result, packet) {
      return packet.body.length
    },
    default: Buffer.from('')
  },
  { name: 'packageLength', type: 'UInt32', offset: 0, length: 4, default (packet) { return packet.headerLength + packet.body.length } }
]
/**
 * 编码器
 */
class Encoder {
  constructor (config = DefaultConfig) {
    this.config = config
  }

  /**
     * 编码
     * @param {any} packet
     */
  encode (packet) {
    // eslint-disable-next-line no-redeclare
    var packet = new Proxy(packet, {
      get (target, name) {
        if (target[name] === undefined) {
          const itemConfig = DefaultConfig.find((item) => { return item.name === name })
          if (itemConfig === undefined || itemConfig.default === undefined) {
            return undefined
          } else if (typeof itemConfig.default === 'function') {
            return itemConfig.default(packet)
          } else {
            return itemConfig.default
          }
        } else {
          return target[name]
        }
      }
    })
    let result = Buffer.alloc(packet.packageLength)
    for (let i = 0; i < this.config.length; i++) {
      const offset = this.config[i].offset
      const length = this.config[i].length
      if (typeof this.config[i].offset === 'function') {
        this.config[i].offset = this.config[i].offset(result, packet)
      }
      if (typeof this.config[i].length === 'function') {
        this.config[i].length = this.config[i].length(result, packet)
      }
      switch (this.config[i].type) {
        case 'UInt32':
          result.writeUInt32BE(packet[this.config[i].name], this.config[i].offset)
          break
        case 'UInt16':
          result.writeUInt16BE(packet[this.config[i].name], this.config[i].offset)
          break
        case 'Buffer':
          result = Buffer.concat([
            result.slice(0, this.config[i].offset),
            packet[this.config[i].name],
            result.slice(this.config[i].offset + this.config[i].length)
          ])
          break
        default:
          throw new Error('Unknown Type : ', this.config[i].type)
      }
    }
    return result
  }
}
module.exports = Encoder
