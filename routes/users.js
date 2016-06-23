var express = require('express');
var router = express.Router();
var userDao = require("../modal/dao/userDao.js");

var logger = require("../util/logger.js");
/* GET users listing. */
router.post('/signup', function(req, res, next) {
    var user = new userDao({
        name:req.body.name,
        pass:req.body.password
    });
    userDao.queryUserNumByName(req.body.name, function(err, result) {
        if (result != 0) {
            req.session.error = "用户名已存在,请重新注册";
            res.redirect("/login");
        } else {
            user.save(function(err, result) {
                req.session.error = "注册成功,请登录";
                res.redirect("/login");
            });
        }
    });
});

router.get('/login', function(req, res, next) {
    var error = "";
    if (req.session["error"]) {
        error = req.session["error"];
    }
    res.render('login', {
        title: '登录',
        page:1,
        error:error
    });
});
router.get('/signup', function(req, res, next) {
    var error = "";
    if (req.session["error"]) {
        error = req.session["error"];
    }
    res.render('signup', {
        title: '注册',
        page:1,
        error:error
    });
});



router.get('/logout', function(req, res, next) {
    req.session.destroy();
    res.locals.isLogin = false;
    res.redirect("/login");
});

router.post('/login', function(req, res, next) {
    logger.log("/login" + JSON.stringify(req.body));
    userDao.queryUserNumByName(req.body.name, function(err, result) {
        console.log(JSON.stringify(result));
        if (result[0]["count(*)"] == 0) {
            req.session.error = "请输入正确用户名";
            res.redirect("/login");
        } else {
            userDao.queryUserByName(req.body.name, function(err, result) {
                if (result.pass != req.body.pass) {
                    req.session.error = "密码不正确";
                    res.redirect("/login");
                } else {
                    req.session.name = req.body.name;
                    res.redirect("/");
                }
            });
        }
    });
});

module.exports = router;
