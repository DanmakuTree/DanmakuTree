import Database from 'better-sqlite3'

export class KVTable {
  /**
   * 创建一个KV表实例
   * @param {import('better-sqlite3').Database} db 数据库
   * @param {string} tableName 表名
   */
  constructor (db, tableName) {
    var dbConnection
    var dbFile = ''
    if (typeof (db) === 'string' && db.includes('.db')) dbFile = db
    else if (typeof (db) === 'string' && !db.includes('.db')) dbFile = `${db}.db`
    else if (db instanceof Database) dbConnection = db
    else { console.log(`${db} might not be a string`); return -1 }

    this._dbFile = dbFile
    this._tableName = tableName
    if (!dbConnection) dbConnection = new Database(dbFile)

    dbConnection.prepare(`CREATE TABLE if not exists "${tableName}" (key TEXT NOT NULL PRIMARY KEY ASC, value TEXT)`).run()
    this._dbConnection = dbConnection
  }

  /**
   * GET获取KV表中, 对应KEY的VALUE：
   * a. 如果VALUE为空则会返回 {value: null}, 空VALUE是正常的数据
   * b. 如果该KEY不存在，则会返回一个 undefined，同时console.log会记录一下异常的GET请求
   * c. 如果KEY存在且VALUE非空，则会返回 {value:string}
   * @date 2020-06-26
   * @param {string} key
   * @returns {string|null|undefined}
   */
  get (key) {
    var stmt = this._dbConnection.prepare(`SELECT value FROM "main"."${this._tableName}" WHERE key=?`)
    var result = stmt.get(String(key))
    if (!result) console.log(`"main"."${this._tableName}" does NOT exist the key ${key}. CHECK your requested key.`)
    return result ? result.value : undefined
  }

  /**
   * SET写入KV表中, 对应KEY的VALUE：
   * @date 2020-06-26
   * @param {string} key
   * @param {string} value
   * @returns {changes} changes
   */
  set (key, value) {
    return this._dbConnection.prepare(`REPLACE INTO "main"."${this._tableName}" (key,value) VALUES (?, ?)`).run(String(key), String(value))
  }

  /**
   * Delete Key-Value Pair BY KEY
   * @date 2020-06-26
   * @param {string} key
   * @returns {changes} changes
   */
  delete (key) {
    return this._dbConnection.prepare(`DELETE FROM "main"."${this._tableName}" WHERE key=?;`).run(String(key))
  }

  /**
   * 返回所有的 keys
   * @date 2020-06-26
   * @returns {[string]} Array of String, contains key names.
   */
  keys () {
    var stmt = this._dbConnection.prepare(`SELECT key FROM "main"."${this._tableName}" ORDER BY key ASC`)
    var keys = []
    stmt.all().forEach((e) => { keys.push(e.key) })
    return keys
  }
}
