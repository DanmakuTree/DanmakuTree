import { isInteger, cloneDeep } from 'lodash'

export class StatisticsTable {
  /**
   * 创建一个统计表实例
   * @param {import('better-sqlite3').Database} db 数据库
   * @param {string} tableName 表名
   */
  constructor (db, tableName, columns = []) {
    this.db = db
    this.tableName = tableName
    this.columns = cloneDeep(columns)
    this.columns.unshift({ name: 'time', type: 'NUMERIC' })
    db.prepare(`CREATE TABLE if not exists "${tableName}" (${createColumns(this.columns)}PRIMARY KEY("time"));`)
      .run()
  }

  push (report) {
    return this.db.prepare(`INSERT INTO "${this.tableName}" VALUES (${pushColumns(this.columns)})`).run(report)
  }

  getAll () {
    return this.db.prepare(`SELECT * FROM "${this.tableName}"`).all()
  }

  getLast (num = 1) {
    if (typeof num !== 'number' || !isInteger(num) || num <= 0) {
      throw new Error('bad argument num: ' + String(num))
    }
    return this.db.prepare(`SELECT * FROM "${this.tableName}" ORDER BY time desc LIMIT ?`).all(num)
  }
}
function createColumns (columns) {
  return columns.map(col => {
    return `"${col.name}" ${col.type}, `
  }).join('')
}
function pushColumns (columns) {
  return columns.map(col => {
    return `:${col.name}`
  }).join(', ')
}
