var express = require('express');
var router = express.Router();
var userDao = require("../modal/dao/userDao.js");
var ccap = require('ccap');
var logger = require("../util/logger.js");
/* GET users listing. */
router.post('/signup', function(req, res, next) {
    var user = new userDao({
        name:req.body.name,
        pass:req.body.password
    });
    userDao.queryUserNumByName(req.body.name, function(err, result) {
        if (result[0]["count(*)"] != 0) {
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


router.get('/getCode', function(req, res, next) {
    var captcha = ccap({
        generate:function(){
            var rnd="";
            for(var i=0;i<5;i++)
                rnd+=Math.floor(Math.random()*10);
            return rnd;
        }
    });
    var ary = captcha.get();
    req.session.code = ary[0];
    console.log(ary[0]);//字符串
    res.write(ary[1]); //
    res.end();
});


router.get('/login', function(req, res, next) {
    var error = "";
    if (req.session["error"]) {
        error = req.session["error"];
    }
    console.log(req.session);
    res.render('login', {
        title: '广州开发区审批监管大数据平台',
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
        title: '广州开发区审批监管大数据平台',
        page:1,
        error:error
    });
});


// router.get('/isLogin', function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', 'http://157.7.108.76:3000');
//     res.header('Access-Control-Allow-Credentials', true);
//     res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     var isLogin = false, name = "";
//     logger.log(JSON.stringify(req.session));
//     if (req.session["name"]) {
//         logger.log("3"); 
//         isLogin = true;
//         name = req.session.name;
//     }
//     res.jsonp({
//         status:1,
//         isLogin:isLogin,
//         name:name
//     });
// });


router.get('/logout', function(req, res, next) {
    req.session.destroy();
    logger.log(JSON.stringify(req.session));
    res.locals.isLogin = false;
    res.redirect("/login");
});

router.post('/login', function(req, res, next) {
    logger.log("/login" + JSON.stringify(req.body));
    if (req.body.code != req.session.code) {
        req.session.error = "请输入正确验证码";
        console.log(req.session.code, req.body.code);
        res.redirect("/login");
        return;
    }
    req.session.error = '';
    userDao.queryUserNumByName(req.body.name, function(err, result) {
        console.log(JSON.stringify(result));
        if (result[0]["count(*)"] == 0) {
            req.session.error = "请输入正确用户名";
            res.redirect("/login");
        } else {
            userDao.queryUserByName(req.body.name, function(err, result) {
                if (result[0].pass != req.body.password) {
                    req.session.error = "密码不正确";
                    res.redirect("/login");
                } else {
                    req.session.name = req.body.name;
                    if (req.body.r_n == 'on') {
                        req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 30 // 30 day;
                        console.log("!!!!!"+req.session.cookie.maxAge);
                    }
                    res.redirect("/");
                }
            });
        }
    });
});

module.exports = router;
