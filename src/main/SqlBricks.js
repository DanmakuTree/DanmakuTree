import flatten from './Utilities/flatten'
var sql = require('sql-bricks-sqlite') // Todo: this should be removed.
// instead, var sql = {} as an empty object to provide utility only.
flatten(JSON)

function split (obj, char = '$') {
  var obj2 = {}
  for (var i of Object.entries(obj)) obj2[i[0]] = `${char}${i[0]}`
  return { prepare: obj2, origin: obj }
}

const typeofMap = {
  string () { return 'TEXT' },
  number (val) { return Number.isInteger(val) ? 'INTEGER' : 'REAL' },
  boolean () { return 'BOOLEAN' },
  undefined () { console.warn('Warning: Undefined data at dmMsgMock, Please checkout between wsRawCmd and Warpper!'); return 'BLOB' }
}

function columnDefine (obj) {
  var flattenObj = JSON.flatten(obj)
  var str = []
  for (var i of Object.entries(flattenObj)) { var type = typeofMap[`${typeof (i[1])}`](i[1]); str.push(`"${i[0]}" ${type}`) }

  return str.join(',')
}

sql.Statement.prototype._toString_ = sql.Statement.prototype.toString
sql.Statement.prototype._toParams_ = sql.Statement.prototype.toParams

sql.Statement.prototype.toString = function () {
  var string = this._toString_()
  while (/'?'|'\$.+'|'@.+'|':.+'/.test(string)) {
    string = string.replace(/'?'|'\$.+'|'@.+'|':.+'/, function (e) { return e.replace("'", '').replace("'", '') })
  }
  return string
}

sql.Statement.prototype.toParams = function (option) {
  var params
  if (option && typeof (option) !== 'string') { return console.log(`toParams does not accept ${option}`) }

  if (/%d/.test(option)) { params = this._toParams_({ placeholder: option }) } else if (option === 'named' || option === 'prepared') { return this.toString() } else { params = this._toParams_({ placeholder: '?' }) }
  // map function() to parse the boolean from (true|false) to (1|0)
  var parsedValues = params.values.map(function (item) { return typeof (item) === 'boolean' ? +item : item })
  return { sqlStr: params.text, valueArray: parsedValues }
}

sql.SplitPrepared = split
sql.columnDefine = columnDefine

export default sql
