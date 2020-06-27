import { isInteger } from 'lodash'

export class StatisticsTable {
  /**
   * 创建一个统计表实例
   * @param {import('better-sqlite3').Database} db 数据库
   * @param {string} tableName 表名
   */
  constructor (db, tableName) {
    this.db = db
    this.tableName = tableName
    db.prepare(`CREATE TABLE if not exists "${tableName}" ("time" NUMERIC,"user" INTEGER,"danmu" INTEGER,"gold" NUMERIC,"totalUser" INTEGER,"totalDanmu" INTEGER,"totalGold" NUMERIC,PRIMARY KEY("time"));`)
      .run()
  }

  push (report) {
    return this.db.prepare(`INSERT INTO "${this.tableName}" VALUES (:time, :user, :danmu, :gold, :totalUser, :totalDanmu, :totalGold)`).run(report)
  }

  getAll () {
    return this.db.prepare(`SELECT * FROM "${this.tableName}"`).run()
  }

  getLast (num = 1) {
    if (typeof num !== 'number' || !isInteger(num) || num <= 0) {
      throw new Error('bad argument num: ' + String(num))
    }
    return this.db.prepare(`SELECT * FROM "${this.tableName}" asc LIMIT ?`).all(num)
  }
}
