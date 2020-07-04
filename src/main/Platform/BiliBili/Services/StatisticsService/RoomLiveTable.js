import { isInteger } from 'lodash'

export class RoomLiveTable {
  /**
   * 创建一个房间直播表实例
   * @param {import('better-sqlite3').Database} db 数据库
   * @param {string} tableName 表名
   */
  constructor (db, tableName) {
    this.db = db
    this.tableName = tableName
    db.prepare(`CREATE TABLE if not exists "${tableName}" ("startTime" NUMERIC, "endTime" NUMERIC, "id" TEXT, "columns" TEXT, "other" TEXT, PRIMARY KEY("id"));`)
      .run()
  }

  push (report) {
    return this.db.prepare(`INSERT INTO "${this.tableName}" (startTime,endTime,id,columns,other,id) VALUES (:startTime, :endTime, :id, :columns, :other, :id)`).run(report)
  }

  updateEndTime (id, endTime) {
    return this.db.prepare(`UPDATE "${this.tableName}" SET (endTime) = (:endTime) WHERE id=:id`).run({ endTime, id })
  }

  getAll () {
    return this.db.prepare(`SELECT * FROM "${this.tableName}"`).all()
  }

  getLast (num = 1) {
    if (typeof num !== 'number' || !isInteger(num) || num <= 0) {
      throw new Error('bad argument num: ' + String(num))
    }
    // db.prepare(`asc LIMIT 0``).all()
    return this.db.prepare(`SELECT * FROM "${this.tableName}" ORDER BY startTime desc LIMIT ?`).all(num)
  }
}
