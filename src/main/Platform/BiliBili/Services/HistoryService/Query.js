import { HistoryTable } from './HistoryTable'

export class Query {
  constructor (_HistoryTable) {
    if (!(_HistoryTable instanceof HistoryTable)) { return false }
    this.HistoryTable = _HistoryTable
  }

  flipByPage (longtimestamp = undefined, pagesize = undefined) {
    var page = this.HistoryTable.getByPageBeforeLongtimestamp(longtimestamp, pagesize)
    if (!page.length) { return false }
    var oldest = page.slice(-1)[0].longtimestamp
    var that = this
    var nextCaller = function () { return that.flipByPage(oldest, pagesize) }
    return { page: page, next: nextCaller }
  }

  count () {
    return this.HistoryTable.count()
  }

  searchComment (str) {
    var countStmt = this.HistoryTable.dbConnection.prepare(`SELECT count(*)
FROM "${this.HistoryTable.tableName}"
WHERE instr(comment, ?)
`)
    var resultStmt = this.HistoryTable.dbConnection.prepare(`SELECT *
FROM "${this.HistoryTable.tableName}"
WHERE instr(comment, ?)
`)
    var count = countStmt.get(str)['count(*)']
    var result = resultStmt.all(str)

    return { count, result }
  }

  searchBetweenDate (startDateIncluded, endDateExcluded) {
    var startDate = new Date(startDateIncluded)
    var endDate = new Date(endDateExcluded)

    var startTime = startDate.getTime()
    var endTime = endDate.getTime()
    var countStmt = this.HistoryTable.dbConnection.prepare(`SELECT count(*)
FROM "${this.HistoryTable.tableName}"
WHERE "longtimestamp">=? AND "longtimestamp"<?
`)
    var resultStmt = this.HistoryTable.dbConnection.prepare(`SELECT *
FROM "${this.HistoryTable.tableName}"
WHERE "longtimestamp">=? AND "longtimestamp"<?
`)
    var count = countStmt.get(startTime, endTime)['count(*)']
    // todo: get by page flip if count is large
    var result = resultStmt.all(startTime, endTime)

    return { count, result }
  }

  searchUid (uid) {
    var countStmt = this.HistoryTable.dbConnection.prepare(`SELECT count(*)
FROM "${this.HistoryTable.tableName}"
WHERE "user.uid" = ?
`)
    var resultStmt = this.HistoryTable.dbConnection.prepare(`SELECT *
FROM "${this.HistoryTable.tableName}"
WHERE "user.uid" = ?
`)
    var count = countStmt.get(uid)['count(*)']
    var result = resultStmt.all(uid)

    return { count, result }
  }

  searchUsername (str) {
    var countStmt = this.HistoryTable.dbConnection.prepare(`SELECT count(*)
FROM "${this.HistoryTable.tableName}"
WHERE instr("user.username", ?)
`)
    var resultStmt = this.HistoryTable.dbConnection.prepare(`SELECT *
FROM "${this.HistoryTable.tableName}"
WHERE instr("user.username", ?)
`)
    var count = countStmt.get(str)['count(*)']
    var result = resultStmt.all(str)

    return { count, result }
  }
}
