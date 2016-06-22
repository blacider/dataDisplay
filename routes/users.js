var express = require('express');
var router = express.Router();
var userDao = require("../modal/dao/userDao.js");


/* GET users listing. */
router.post('/signup', function(req, res, next) {
    var user = new userDao({
        name:req.body.name,
        pass:req.body.password
    });
    user.save(function(err, result) {
        res.json({
            code:1,
            msg:"注册成功"
        });
    });
});

router.post('/login', function(req, res, next) {
    userDao.queryUserNumByName(req.body.name, function(err, result) {
        if (result == 0) {
            res.json({
                code:0,
                msg:"请输入正确用户名"
            });
        } else {
            userDao.queryUserByName(req.body.name, function(err, result) {
                if (result.pass != req.body.pass) {
                    res.json({
                        code:-1,
                        msg:"密码不正确"
                    });
                } else {
                    res.json({
                        code:1,
                        msg:"登录成功"
                    });
                }
            });
        }
    });
});

module.exports = router;
