// dao/caseDao.js
// 实现与MySQL交互
var mysql = require('mysql');
var $conf = require('../conf/db');
var $util = require('../util/util');
var $sql = {
    save:"INSERT INTO user(id,name,pass) VALUES(0,?,?)",
    queryUserByName: 'SELECT * FROM user WHERE name = ?',
    queryUserNumByName: "SELECT * FROM user WHERE username = ?"
};

// 使用连接池，提升性能
var pool  = mysql.createPool($util.extend({}, $conf.mysql));


function User(user) {
    this.name = user.name;
    this.pass = user.pass;
}
module.exports = User;

User.prototype.save = function(callback) {
    var user = {
        name : this.name,
        pass : this.pass
    };
    pool.getConnection(function(err, connection) {
        connection.query($sql.save, [user.name, user.pass], function(err, result) {
            if (err) {
                res.json({
                    code:0,
                    msg:err
                });
                return;
            }
            callback(err, result);
            connection.release();
        });
    });   
}

User.queryUserByName = function(name, callback) {
    pool.getConnection(function(err, connection) {
        connection.query($sql.queryUserByName, [name], function(err, result) {
            if (err) {
                res.json({
                    code:0,
                    msg:err
                });
                return;
            }
            callback(err, result);
            connection.release();
        });
    });  
}
User.queryUserNumByName = function(name, callback) {
    pool.getConnection(function(err, connection) {
        connection.query($sql.queryUserNumByName, [name], function(err, result) {
            if (err) {
                res.json({
                    code:0,
                    msg:err
                });
                return;
            }
            callback(err, result);
            connection.release();
        });
    });  
}
