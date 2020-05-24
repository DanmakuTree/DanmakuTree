/**
 * @typedef {(package:any,rawdata:Buffer)=>Number} NeedCalcNumber
 */
/**
 * @typedef {{name:string,type:string,offset:(Number|NeedCalcNumber),length:(Number|NeedCalcNumber),default:any}} protocolItem
 */
/**
 * @type {Array<protocolItem>}
 */
var DefaultConfig = [
  { name: 'packageLength', type: 'UInt32', offset: 0, length: 4 },
  { name: 'headerLength', type: 'UInt16', offset: 4, length: 2 },
  { name: 'protocolVersion', type: 'UInt16', offset: 6, length: 2 },
  { name: 'operation', type: 'UInt32', offset: 8, length: 4 },
  { name: 'sequenceId', type: 'UInt32', offset: 12, length: 4 },
  {
    name: 'body',
    type: 'Buffer',
    offset (packet, rawdata) {
      return packet.headerLength
    },
    length (packet, rawdata) {
      return packet.packageLength - packet.headerLength
    }
  }
]

/**
 * 解析器
 */
class Decoder {
  constructor (config = DefaultConfig) {
    this.config = config
  }

  /**
     * 解析
     * @param {Buffer} packet
     */
  decode (packet) {
    const result = {}
    for (let i = 0; i < this.config.length; i++) {
      let offset = this.config[i].offset
      let length = this.config[i].length
      if (typeof this.config[i].offset === 'function') {
        offset = this.config[i].offset(result, packet)
      }
      if (typeof this.config[i].length === 'function') {
        length = this.config[i].length(result, packet)
      }
      switch (this.config[i].type) {
        case 'UInt32':
          result[this.config[i].name] = packet.readUInt32BE(this.config[i].offset)
          break
        case 'UInt16':
          result[this.config[i].name] = packet.readUInt16BE(this.config[i].offset)
          break
        case 'Buffer':
          result[this.config[i].name] = packet.slice(offset, offset + length)
          break
        default:
          throw new Error('Unknown Type : ', this.config[i].type)
      }
    }
    return result
  }
}
module.exports = Decoder
