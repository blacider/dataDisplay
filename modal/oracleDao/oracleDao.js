var oracledb = require('oracledb');
var dbConfig = require('../conf/oracle.js');
var $util = require('../util/util');

module.exports = {
    query: function(sql, callback) {
        console.log(sql);
        oracledb.getConnection(
            $util.extend({}, dbConfig.oracle),
            function(err, connection) {
            if (err) {
              console.error(err.message);
              return;
            }
            connection.execute(sql, function(err, result) {
                if (err) {
                    console.error(err.message);
                    return;
                }
                doRelease(connection);
                callback(result);
            });
          });
    }
}


function doRelease(connection)
{
  connection.release(
    function(err) {
      if (err) {
        console.error(err.message);
      }
    });
}