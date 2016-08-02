var express = require('express');
var router = express.Router();

var oracleDao = require('../modal/oracleDao/oracleDao.js');

router.get('/oracle', function(req, res, next) {
    oracleDao.query("select count(*) from exdb.ssdj_jbxx", function(result) {
        res.json(JSON.stringify(result));
    });
});
router.get('/getComData', function(req, res, next) {
    // [1,10]
    var p = 1, tableNames = {
        ZCH: '统一社会信用代码<br>（组织结构代码）',
        MC: '企业名称',
        DZ: '地址',
        ZTZT: '经营状态'
    };
    if (req.query.p) p = Number(req.query.p);
    var end = p*10;
    oracleDao.query("SELECT ZCH, MC, DZ, ZTZT FROM (SELECT A.*, ROWNUM RN FROM (SELECT * FROM exdb.ssdj_jbxx) A WHERE ROWNUM <= " + end + ") WHERE RN >= " + (end-10),
    function(result) {
        var table = result["rows"];
        var tableData = [], tmp = {}, j;
        for (var i = 0; i <= 9; i++) {
            j = 0;
            tmp = {};
            for (item in tableNames) {
                tmp[item] = table[i][j];
                j++;
            }
            tableData.push(tmp);
        }
        res.json({
            table:tableData
        });
    });
});

router.get('/getComDataByAttr', function(req, res, next) {
    var n = req.query.n, v = req.query.v;
    oracleDao.query("SELECT ZCH,"+n+" FROM exdb.ssdj_jbxx where "+n+" like '%"+v+"%' and rownum <= 5",
    function(result) {
        res.json({
            data:result
        });
    });
});

router.get('/com', function(req, res, next) {
    var zch = req.query.ZCH;
    oracleDao.query("SELECT * FROM exdb.ssdj_jbxx where ZCH = '"+zch+"'", function(result) {
        res.render('com', {
            title: '广州开发区审批监管大数据平台',
            data:result["rows"][0]
        });
    });
});

router.get('/sf', function(req, res, next) {
    // [1,10]
    var p = 1;
    if (req.query.p) p = Number(req.query.p);
    var end = p*10;
    oracleDao.query("SELECT FN, NAME, MONTH, SHORT, CONSUMPTION, INDUSTRY FROM (SELECT A.*, ROWNUM RN FROM (SELECT * FROM WEBLH.T_WATER_NRESIDENT) A WHERE ROWNUM <= " + end + ") WHERE RN >= " + (end-10),
    function(result) {
        var table = result["rows"];
        var tableData = [], tmp = {};
        for (var i = 0; i <= 9; i++) {
            tmp = {};
            for (var j = 0; j < result["metaData"].length; j++) {
                if (result["metaData"][j]["name"] == "MONTH") {
                    tmp[result["metaData"][j]["name"]] = (table[i][j] != null)?table[i][j].toLocaleDateString():"";
                } else {
                    tmp[result["metaData"][j]["name"]] = (table[i][j] != null)?table[i][j]:"";
                }
            }
            tableData.push(tmp);
        }
        console.log(JSON.stringify(tableData));
        res.json({
            table:tableData
        });
    });
});
router.get('/df', function(req, res, next) {
    // [1,10]
    var p = 1;
    if (req.query.p) p = Number(req.query.p);
    var end = p*10;
    oracleDao.query("SELECT ID,NAME,MONTH,TYPE,CONSUMPTION FROM (SELECT A.*, ROWNUM RN FROM (SELECT * FROM WEBLH.T_ELECTRICITY) A WHERE ROWNUM <= " + end + ") WHERE RN >= " + (end-10),
    function(result) {
        var table = result["rows"];
        var tableData = [], tmp = {};
        for (var i = 0; i <= 9; i++) {
            tmp = {};
            for (var j = 0; j < result["metaData"].length; j++) {
                if (result["metaData"][j]["name"] == "MONTH") {
                    tmp[result["metaData"][j]["name"]] = (table[i][j] != null)?table[i][j].toLocaleDateString():"";
                } else {
                    tmp[result["metaData"][j]["name"]] = (table[i][j] != null)?table[i][j]:"";
                }
            }
            tableData.push(tmp);
        }
        console.log(JSON.stringify(tableData));
        res.json({
            table:tableData
        });
    });
});
router.get('/gs', function(req, res, next) {
    // [1,10]
    var p = 1;
    if (req.query.p) p = Number(req.query.p);
    var end = p*10;
    oracleDao.query("SELECT ZCH,MC,FDDBR,ZYXMLB,DZ,CLRQ FROM (SELECT A.*, ROWNUM RN FROM (SELECT * FROM exdb.ssdj_jbxx) A WHERE ROWNUM <= " + end + ") WHERE RN >= " + (end-10),
    function(result) {
        var table = result["rows"];
        var tableData = [], tmp = {};
        for (var i = 0; i <= 9; i++) {
            tmp = {};
            for (var j = 0; j < result["metaData"].length; j++) {
                if (result["metaData"][j]["name"] == "MONTH") {
                    tmp[result["metaData"][j]["name"]] = (table[i][j] != null)?table[i][j].toLocaleDateString():"";
                } else {
                    tmp[result["metaData"][j]["name"]] = (table[i][j] != null)?table[i][j]:"";
                }
            }
            tableData.push(tmp);
        }
        console.log(JSON.stringify(tableData));
        res.json({
            table:tableData
        });
    });
});

router.get('/jbxx', function(req, res, next) {
    oracleDao.query("select clrq, czsj from EXDB.EX_GONGSHANG_41V2_SSZTJCXX where zch = '"+req.query.zch+"'",
    function(result) {
        res.render('jbxx', {
            data:result["rows"]
        });
    });
});
router.get('/spxx', function(req, res, next) {
    oracleDao.query("select a.ORIGINAl_SEQ, start_date, unit_name, approve_item, complete_date from lg_base.V_SP_SHENQIN@TO_QYXX a, lg_base.V_SP_SHENPIFISH@TO_QYXX b where a.ORIGINAl_SEQ = b.ORIGINAl_SEQ and a.cust_name like '%"+req.query.name+"%'",
    function(result) {
        res.render('spxx', {
            data:result["rows"]
        });
    });
});
router.get('/jwxx', function(req, res, next) {
    oracleDao.query("select to_char(ywid), startdate, undertakedepartment, '日常巡查', 'sa.T_YYYD_ZF_MAIN', 'ywid' from sa.T_YYYD_ZF_MAIN where unitname like '%"+req.query.name+"%'\
    union all\
    select to_char(ywid), starttime, undertakedepart, '行政处罚', 'sa.T_YYYD_LA_MAIN', 'ywid' from sa.T_YYYD_LA_MAIN where PARTY like '%"+req.query.name+"%'\
    union all\
    select to_char(id), start_time , '劳动局', '日常巡查', 'ldzf.QY_RCXC_REAL', 'id' from ldzf.QY_RCXC_REAL where qy_name like '%"+req.query.name+"%'\
    union all\
    select uuid, check_time_start,safety_dept_name, '日常巡查', 'lgsafe.site_check_record', 'uuid' from lgsafe.site_check_record where corp_name like '%"+req.query.name+"%'\
    union all\
    select id, jcjssj, '市场局', '日常巡查', 'LGYJ_CYJG.B_CY_RC_J_XCJC', 'id' from LGYJ_CYJG.B_CY_RC_J_XCJC where jcqymc like '%"+req.query.name+"%'\
    union all\
    select uuid, create_date,'安检局', '行政处罚' ,'lgsafe.case', 'uuid' from lgsafe.case where case_member like '%"+req.query.name+"%'\
    ",
    function(result) {
        res.render('jwxx', {
            data:result["rows"]
        });
    });
});
var tableNames = {
    'lgsafe.case':{
        'CREATE_DATE':"处罚日期",
        'MAIN_PERSON':"执法人",
        'CASE_NAME':"案件名",
        'CASE_SITUATION':"案件结果",
        'UNIT_PUNISH_MONEY':"处罚金额"
    },
    'sa.T_YYYD_ZF_MAIN':{
        "STARTDATE":"检查日期",
        "UNDERTAKEDEPARTMENT":"监管部门",
        "日常巡查":"监管类别",
        "RESEARCHMAN":"执法人员",
        "QDLX":"启动来源",
        "ISREGISTER":"是否立案"
    },
    'sa.T_YYYD_LA_MAIN':{
        "STARTTIME":"立案时间",
        "UNDERTAKEMAN":"承办人",
        "PARTY":"当事人",
        "NAME":"案件来源",
        "UNDERTAKEDEPART":"承办部门",
        "CASEINTRODU":"案件介绍",
        "PUNISHADVICE":"处罚建议"
    },
    'ldzf.QY_RCXC_REAL':{
        "START_TIME":"检查时间",
        "CONTENT":"检查内容",
        "QUESTION":"存在问题",
        "MEASURE":"监察措施",
        "MAIN_MAN":"主办监察员",
        "ASS_MAN":"协办监察员"
    },
    'lgsafe.site_check_record':{
        "CHECK_TIME_START":"检查时间",
        "SAFETY_DEPT_NAME":"检查部门",
        "CHECK_MAN":"执法人员"
    },
    'LGYJ_CYJG.B_CY_RC_J_XCJC':{
        "JCJSSJ":"检查日期",
        "ZFRQM":"执法人员",
        "SPJCJL":"检查结果"
    }
};
router.get('/item', function(req, res, next) {
    var table = req.query.t,
        name = req.query.n,
        id = req.query.id,
        index = {};

    oracleDao.query("select * from "+table+" where "+name+"= '"+id+"'",
    function(result) {
        for (var i = 0; i < result["metaData"].length; i++) {
            index[result["metaData"][i]["name"]]=i;
        }
        var res_ = [], tmp;
        for (var i = 0; i < result["rows"].length; i++) {
            tmp = {};
            for (item in tableNames[table]) {
                tmp[item] = (index[item] != undefined)?(result["rows"][i][index[item]]):(item);
            }
            res_.push(tmp);
        }
        console.log(res_);
        res.render('item', {
             title:'广州开发区审批监管大数据平台',
             table:res_,
             tableNames:tableNames[table]
        });
    });
});
module.exports = router;