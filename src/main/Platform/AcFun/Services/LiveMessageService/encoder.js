import { AcFunDanmu } from '../../proto'
import { createCipheriv, randomBytes } from 'crypto'
export const MagicNumber = Buffer.from([0xAB, 0xCD, 0x00, 0x01])

export class AcFunPacket {
  constructor () {
    this.header = new AcFunDanmu.PacketHeader()
    /**
     * @type {Buffer}
     */
    this.payload = null
  }
}

export class Encoder {
  /**
   *
   * @param {AcFunPacket} packet
   * @param {String} key
   */
  encode (packet, key) {
    const header = AcFunDanmu.PacketHeader.encode(packet.header).finish()
    const aesiv = randomBytes(16)
    const cipher = createCipheriv('aes-128-cbc', Buffer.from(key, 'base64'), aesiv)
    const body = Buffer.concat([cipher.update(packet.payload), cipher.final()])
    const realheader = Buffer.alloc(12)
    MagicNumber.copy(realheader, 0, 0, 4)
    realheader.writeUInt32BE(header.length, 4)
    realheader.writeUInt32BE(body.length, 8)
    return Buffer.concat([realheader, header, aesiv, body])
  }
}
