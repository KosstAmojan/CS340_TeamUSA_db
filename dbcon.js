var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_frysj',
  password        : '3402',
  database        : 'cs340_frysj'
});
module.exports.pool = pool;