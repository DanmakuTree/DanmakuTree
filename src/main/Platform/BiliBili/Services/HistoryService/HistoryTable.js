import { isInteger } from 'lodash'
import sql from '../../../../SqlBricks.js'
import { Warpper } from '../DanmakuService/Warpper'
import flatten from '../../../../Utilities/flatten'
import Database from 'better-sqlite3'
flatten(JSON)

// MockData, intended to use JSON.pare() from a string to escape the eslint limit to JSON code style
var wsRawCmd = JSON.parse('{"cmd":"DANMU_MSG","info":[[0,8,67,84370489,2483896600268,5509017932,0,"QZrE9aOf",0,0,0],"2b",[675134738,"5DuK676xs",0,0,0,16516,2,""],[43,"6m2","3W8QG5",723768,22105086,"",0],[61,0,5066127,"HaKwpA"],["B4MdiWHMpPC","aSeQNT6pAwT"],0,0,null,{"ts":1266756497,"ct":"XbLP2W21"},0,0,null,null,0]}')
var warpper = new Warpper()
export var dmMsgMock = warpper.warp(wsRawCmd)

export class HistoryTable {
  /**
   * 创建一个弹幕历史表实例
   * @param {string | import('better-sqlite3').Database} db 数据库
   * @param {string} tableName 表名
   */
  constructor (db, tableName) {
    var dbConnection
    var dbFile = ''
    if (typeof (db) === 'string' && db.includes('.db')) dbFile = db
    else if (typeof (db) === 'string' && !db.includes('.db')) dbFile = `${db}.db`
    else if (db instanceof Database) dbConnection = db
    else { console.log(`${db} might not be a string`); return -1 }

    this.db = dbFile
    this.tableName = tableName
    if (!dbConnection) dbConnection = new Database(dbFile)
    this.dbConnection = dbConnection

    dbConnection.prepare(`CREATE TABLE if not exists "${tableName}" (${sql.columnDefine(dmMsgMock.data)},PRIMARY KEY("longtimestamp","user.uid"));`)
      .run()
  }

  push (danmu) {
    var danmuFlatten = JSON.flatten(danmu.data)
    var ds = sql.insertInto(this.tableName, danmuFlatten).toParams()
    // todo: tofix: should use sql...toParams() to automatic prepare the query, but it has bugs
    return this.dbConnection.prepare('INSERT INTO tt ("comment", "longtimestamp", "timestamp", "user.uid", "user.username", "user.isAdmin", "user.platformVIPLevel", "user.userLevel", "user.roomVIPLevel", "user.medal.level", "user.medal.label", "user.medal.anchorUsername", "user.medal.roomId", "user.title.0", "user.title.1", "validation.ts", "validation.ct") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').run(...ds.valueArray)
  }

  getAll () {
    return this.dbConnection.prepare(`SELECT * FROM "${this.tableName}" ORDER BY longtimestamp ASC`).all()
  }

  getLatest (num = 1) {
    if (typeof num !== 'number' || !isInteger(num) || num <= 0) {
      throw new Error('bad argument num: ' + String(num))
    }
    // db.prepare(`asc LIMIT 0``).all()
    return this.dbConnection.prepare(`SELECT * FROM "${this.tableName}" ORDER BY longtimestamp DESC LIMIT ?`).all(num)
  }

  getByPageBeforeLongtimestamp (longtimestamp = Math.pow(10, 13) - 1, pagesize = 500) {
    if (typeof pagesize !== 'number' || !isInteger(pagesize) || pagesize <= 0) {
      throw new Error('bad argument pagesize: ' + String(pagesize))
    }
    if (typeof longtimestamp !== 'number' || !isInteger(longtimestamp) || String(longtimestamp).length !== 13) {
      throw new Error('bad argument longtimestamp: ' + String(longtimestamp))
    }

    return this.dbConnection.prepare(`
SELECT * 
FROM "${this.tableName}" 
WHERE longtimestamp < ${longtimestamp} 
ORDER BY longtimestamp DESC
LIMIT ${pagesize}
    `).all()
  }
}
