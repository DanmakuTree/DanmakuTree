var sql = require('sql-bricks-sqlite')

function split (obj, char = '$') {
  var obj2 = {}
  for (var i of Object.entries(obj)) obj2[i[0]] = `${char}${i[0]}`
  return { prepare: obj2, origin: obj }
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
  return { sqlStr: params.text, valueArray: params.values }
}

sql.SplitPrepared = split

export default sql
