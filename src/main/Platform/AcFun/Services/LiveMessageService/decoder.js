import { AcFunDanmu } from '../../proto'
import { createDecipheriv } from 'crypto'
export class Decoder {
  constructor () {

  }

  /**
   *
   * @param {Buffer} buffer
   */
  decode (buffer) {
    var result = {}
    var magic = buffer.readUInt32BE(0)
    if (magic !== 2882338817) {
      throw new Error('not acfun buffer')
    }
    result.headerLength = buffer.readUInt32BE(4)
    result.encryptedPayloadLength = buffer.readUInt32BE(8)
    result.header = AcFunDanmu.PacketHeader.decode(buffer.slice(12, 12 + result.headerLength))
    result.aesiv = buffer.slice(12 + result.headerLength, 28 + result.headerLength)
    result.encryptedBody = buffer.slice(28 + result.headerLength, 12 + result.headerLength + result.encryptedPayloadLength)
    try {
      var decipher = createDecipheriv('aes-128-cbc', Buffer.from('SIa6GSYJtIifCiAxKwrfxQ==', 'base64'), result.aesiv)
      result.body = decipher.update(result.encryptedBody)
      result.body += decipher.final('binary')
    } catch (error) {
      console.log(error)
    }
    return result
  }
}
