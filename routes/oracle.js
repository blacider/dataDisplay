var express = require('express');
var router = express.Router();

var oracleDao = require('../modal/oracleDao/oracleDao.js');

router.get('/oracle', function(req, res, next) {
    oracleDao.query("select count(*) from exdb.ssdj_jbxx", function(result) {
        res.json(JSON.stringify(result));
    });
});
function getDate(d) {
  if (!d) return '';
  var dd = new Date(d);
  return dd.getFullYear()+"年"+(dd.getMonth()+1)+"月"+dd.getDate()+"日";
}
function getMonthDate(d) {
  if (!d) return '';
  var dd = new Date(d);
  return dd.getFullYear()+"年"+(dd.getMonth()+1)+"月";
}
router.get('/xx', function(req, res, next) {
    var resultsData = {'用水用电':{}},total, name=req.query.name, index = 0, zch = req.query.zch, addr = req.query.addr;
    var renderData = function() {
        console.log(resultsData);
        res.render('xx',{data:resultsData});
    }
    var renderDataY = function() {
        console.log(resultsData);
        res.render('yy',{data:resultsData});
    }
    if (req.query.n == 'jb') {
        total = 8;
        oracleDao.query("select zch, mc, fddbr, zyxmlb, jyfw, xkjyfw, dz\
        from exdb.ssdj_jbxx where zch = '"+zch+"'\
        ", function(result) {
            var data = result["rows"];
            resultsData['基本信息'] = {
                '注册号':data[0][0],
                '名称':data[0][1],
                '法定代表人':data[0][2],
                '主经营类别':data[0][3],
                '经营类别':data[0][4],
                '许可经营范围':data[0][5],
                '注册地址':data[0][6]
            };
            if (++index == total) renderData();
        });
        oracleDao.query("select gdmc, gdlx, gdgj, rjcze, rjbl\
        from exdb.ssdj_gdxx\
        where zch = '"+zch+"'\
        ", function(result) {
            var data = result["rows"];
            resultsData['股东信息'] = [];
            for (var i = 0; i < data.length; i++) {
                resultsData['股东信息'].push({
                    '股东名称':data[i][0],
                    '股东类型':data[i][1],
                    '股东国籍':data[i][2],
                    '金额':data[i][3],
                    '比例':data[i][4]
                })
            }
            if (++index == total) renderData();
        });
        oracleDao.query("select xm,zw,xb from exdb.ssdj_zzjg\
        where zch = '"+zch+"'\
        ", function(result) {
            var data = result["rows"];
            resultsData['组织结构'] = [];
            for (var i = 0; i < data.length; i++) {
                resultsData['组织结构'].push({
                    '姓名':data[i][0],
                    '职位':data[i][1],
                    '性别':data[i][2],
                })
            }
            if (++index == total) renderData();
        });
        oracleDao.query("select month, consumption from\
        WEBLH.T_ELECTRICITY where name = '"+name+"' and consumption != '0'\
        order by month desc\
        ", function(result) {
            if (result["rows"].length == 0) {
                if (++index == total) renderData();
                return;
            }
            var data = result["rows"], m, s = 0, d = 0;
            m = getMonthDate(data[0][0]);
            s = Number(data[0][1]);
            for (var i = 1; i < data.length; i++) {
                if (getMonthDate(data[i][0]) == m) {
                    s += Number(data[i][1]);
                } else {
                    if (!resultsData['用水用电'][m]) resultsData['用水用电'][m] = {};
                    resultsData['用水用电'][m]['用电量']=s;
                    m = getMonthDate(data[i][0]);
                    s = Number(data[i][1]);
                }
            }
            if (++index == total) renderData();
        });
        oracleDao.query("select month, consumption from\
        WEBLH.T_WATER_NRESIDENT where name = '"+name+"' and consumption != '0'\
        order by month desc\
        ", function(result) {
            if (result["rows"].length == 0) {
                if (++index == total) renderData();
                return;
            }
            var data = result["rows"], m, s = 0, d = 0;
            m = getMonthDate(data[0][0]);
            s = Number(data[0][1]);
            for (var i = 1; i < data.length; i++) {
                if (getMonthDate(data[i][0]) == m) {
                    s += Number(data[i][1]);
                } else {
                    if (!resultsData['用水用电'][m]) resultsData['用水用电'][m] = {};
                    resultsData['用水用电'][m]['用水量']=s;
                    m = getMonthDate(data[i][0]);
                    s = Number(data[i][1]);
                }
            }
            if (++index == total) renderData();
        });
        oracleDao.query("select xmmc, dbsdj,dxsdj,hsdj,hjkqdj, jsqswl,jshswl, swzl, sgqfs, trdj, zsdj from sa.T_YYYD_HBSP_LGHPZL\
        where jsdwmc = '"+name+"'\
        ", function(result) {
            var data = result["rows"];
            resultsData['项目环评'] = data;
            if (++index == total) renderData();
        });
        oracleDao.query("select LZFZRLXDH,SBZH,RSZY,CYRS,BSHJZGRS,FBSSNGZRS,WGJCYRS,SYGZZE,SYZDGZ,FQRZYGZDSX,SYRJGZ,SYZFGZRS\
        from ldzf.ldzf_qyygjcxx\
        where dwmc = '"+name+"'\
        ", function(result) {
            var data = result["rows"];
            resultsData['用工信息'] = data;
            if (++index == total) renderData();
        });
        oracleDao.query("select b.COMMODITY_NUM,b.USAGE_NUM, b.NAME, b.DANGER_FEATURE,c.HARM_NAME,c.OPERATION_NAME,c.SOURCE_NAME,c.OPERATION from LGSAFE.corp_basic_info a, LGSAFE.corp_chemical_product b, LGSAFE.harm_data_info c where c.corp_uuid = a.uuid and b.corp_uuid = a.uuid and \
            a.corp_name like '%+name+%'\
        ", function(result) {
            var data = result["rows"];
            resultsData['危险品'] = data;
            if (++index == total) renderData();
        });
    } else {
        total = 5;
        oracleDao.query("select * from\
                    (select APPROVE_ITEM, CUST_CONTACT_PERSON,CUST_CONTACT_WAY,CUST_ADDR,CUST_MOBILE,start_man,start_date,UNIT_NAME,complete_man,complete_date\
                    from lg_base.V_SP_SHENQIN@oanet37 a left join\
                    lg_base.V_SP_SHENPIFISH@oanet37 b on a.control_seq = b.control_seq\
                    where a.cust_name like '%"+name+"%'\
                    union all\
                    select APPROVE_ITEM, CUST_CONTACT_PERSON,CUST_CONTACT_WAY,CUST_ADDR,CUST_MOBILE,start_man,start_date,UNIT_NAME,complete_man,complete_date  from lg_base.V_SP_SHENQIN@TO_QYXX a, lg_base.V_SP_SHENPIFISH@TO_QYXX b where a.ORIGINAl_SEQ = b.ORIGINAl_SEQ and a.cust_name like '%"+name+"%'\
                    )\
                    order by start_date desc\
        ", function(result) {
            var data = result["rows"];
            for (item of data) {
                item[6] = getDate(item[6]);
                item[9] = getDate(item[9]);
            }
            resultsData['监管信息'] = data;
            if (++index == total) renderDataY();
        });
        oracleDao.query("select '环保许可证', LICENSENUMBER, POLLUTIONTYPE, '广州开发区建设和环境保护局',  REGEXP_SUBSTR(LICENSEVALIDITY,'[^至]+',1,1,'i'),REGEXP_SUBSTR(LICENSEVALIDITY,'[^至]+',1,2,'i'),''\
        from SA.T_YYYD_XKZ_MAIN where entername = '"+name+"'\
        ", function(result) {
            var data = result["rows"];
            resultsData['环保'] = data;
            if (++index == total) renderDataY();
        });
        oracleDao.query("select '食品经营许可',xkzbh,jyxm_zw,creator_partname,xkksrq,xkjsrq,'' from lgyj_xdr.b_xdr_sp_jy_zsxx\
        where qymc like '%"+name+"%'\
        ", function(result) {
            var data = result["rows"];
            resultsData['市场'] = data;
            if (++index == total) renderDataY();
        });
        oracleDao.query("select '化妆品许可',xkzbh,pzscxm,'市场局',to_char(create_time,'yyyy-mm-dd'),to_char(yxq,'yyyy-mm-dd'),'' from lgyj_xdr.b_xdr_hzp_fac_zsxx\
        where qymc like '%"+name+"%'\
        ", function(result) {
            var data = result["rows"];
            resultsData['化妆'] = data;
            if (++index == total) renderDataY();
        });
        oracleDao.query("select credentials_name,credentials_code,licenses_range,award_unit, to_char(award_date,'yyyy-mm-dd'),to_char(valid_end,'yyyy-mm-dd') ,'' from lgsafe.corp_credentials\
        where CORP_NAME like '%"+name+"%'\
        ", function(result) {
            var data = result["rows"];
            resultsData['安'] = data;
            if (++index == total) renderDataY();
        });
    }
    
});
router.get('/getComData', function(req, res, next) {
    // [1,10]
    var p = 1, tableNames = {
        ZCH: '统一社会信用代码<br>（组织结构代码）',
        MC: '企业名称',
        DZ: '地址',
        ZTZT: '经营状态',
        SUPERVISE_RANK: '监管等级'
    };
    if (req.query.p) p = Number(req.query.p);
    var end = p*10;
    oracleDao.query("SELECT ZCH, MC, DZ, ZTZT, SUPERVISE_RANK FROM (SELECT A.*, ROWNUM RN FROM (SELECT * FROM (select * from exdb.ssdj_jbxx aa left join lgsafe.corp bb on aa.zch = bb.business_num order by clrq desc) where ztzt like '%"+ req.query.ztzt +"%') A WHERE ROWNUM <= " + end + ") WHERE RN >= " + (end-9),
    function(result) {
        var table = result["rows"];
        var tableData = [], tmp = {}, j;
        for (var i = 0; i < table.length; i++) {
            j = 0;
            tmp = {};
            for (item in tableNames) {
                tmp[item] = table[i][j];
                j++;
            }
            if (!tmp['SUPERVISE_RANK']) tmp['SUPERVISE_RANK'] = "无";
            else tmp['SUPERVISE_RANK'] = "安监："+tmp['SUPERVISE_RANK'];
            tableData.push(tmp);
        }
        oracleDao.query("SELECT count(*) FROM exdb.ssdj_jbxx aa left join lgsafe.corp bb on aa.zch = bb.business_num where ztzt like '%"+ req.query.ztzt +"%'", function(data) {
            total = data["rows"][0];
            res.json({
                table:tableData,
                total:total
            });
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
    var p = 1, search = req.query.search.trim().split('').join("%");
    if (req.query.p) p = Number(req.query.p);
    var end = p*10;
    var total = 10002;
    oracleDao.query("SELECT FN, NAME, MONTH, CONSUMPTION, INDUSTRY FROM (SELECT A.*, ROWNUM RN FROM (SELECT * FROM WEBLH.T_WATER_NRESIDENT where name like '%"+search+"%' order by month desc,id) A WHERE ROWNUM <= " + end + ") WHERE RN > " + (end-10),
    function(result) {
        var table = result["rows"];
        var tableData = [], tmp = {};
        for (var i = 0; i < table.length; i++) {
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
        oracleDao.query("SELECT count(*) FROM WEBLH.T_WATER_NRESIDENT where name like '%"+search+"%'", function(data) {
            total = data["rows"][0];
            res.json({
                table:tableData,
                total:total
            });
        });
    });
});
router.get('/df', function(req, res, next) {
    // [1,10]
    var p = 1, search = req.query.search.trim().split('').join("%");
    if (req.query.p) p = Number(req.query.p);
    var end = p*10;
    var total = 10002;
    oracleDao.query("SELECT ID,NAME,MONTH,TYPE,CONSUMPTION FROM (SELECT A.*, ROWNUM RN FROM (SELECT * FROM WEBLH.T_ELECTRICITY where name like '%"+search+"%' order by month desc,id) A WHERE ROWNUM <= " + end + ") WHERE RN > " + (end-10),
    function(result) {
        var table = result["rows"];
        var tableData = [], tmp = {};
        for (var i = 0; i < table.length; i++) {
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
        oracleDao.query("SELECT count(*) FROM WEBLH.T_ELECTRICITY where name like '%"+search+"%'", function(data) {
            total = data["rows"][0];
            res.json({
                table:tableData,
                total:total
            });
        });
    });
});
router.get('/gs', function(req, res, next) {
    // [1,10]
    var p = 1, search = req.query.search.trim().split('').join("%");
    if (req.query.p) p = Number(req.query.p);
    var end = p*10;
    var total = 10002;
    oracleDao.query("SELECT ZCH,MC,FDDBR,ZYXMLB,DZ,CLRQ FROM (SELECT A.*, ROWNUM RN FROM (SELECT * FROM exdb.ssdj_jbxx where mc like '%"+search+"%' order by clrq desc) A WHERE ROWNUM <= " + end + ") WHERE RN >= " + (end-10),
    function(result) {
        var table = result["rows"];
        var tableData = [], tmp = {};
        for (var i = 0; i < table.length; i++) {
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
        oracleDao.query("SELECT count(*) FROM exdb.ssdj_jbxx where mc like '%"+search+"%'", function(data) {
            total = data["rows"][0];
            res.json({
                table:tableData,
                total:total
            });
        });
    });
});
router.get('/sp', function(req, res, next) {
    // [1,10]
    var p = 1, search = req.query.search.trim().split('').join("%");
    if (req.query.p) p = Number(req.query.p);
    var end = p*10;
    var total = 10002;
    oracleDao.query("\
        SELECT approve_item,cust_name , start_date,  complete_date, '批准'\
        FROM (SELECT approve_item,cust_name , start_date,  complete_date, '批准', ROWNUM RN \
              FROM (select aa.*,b.* from lg_base.V_SP_SHENQIN@TO_QYXX  aa,lg_base.V_SP_SHENPIFISH@TO_QYXX b \
                    where aa.ORIGINAl_SEQ = b.ORIGINAl_SEQ  \
                    order by start_date desc)   \
              WHERE cust_name like '%"+search+"%'  and ROWNUM <= " + end + ")\
        WHERE RN > " + (end-10),
    function(result) {
        var table = result["rows"];
        var tableData = [], tmp = {};
        for (var i = 0; i < table.length; i++) {
            tmp = {};
            for (var j = 0; j < result["metaData"].length; j++) {
                if (result["metaData"][j]["name"] == "START_DATE" || result["metaData"][j]["name"] == "COMPLETE_DATE") {
                    tmp[result["metaData"][j]["name"]] = (table[i][j] != null)?getDate(table[i][j]):"";
                } else {
                    tmp[result["metaData"][j]["name"]] = (table[i][j] != null)?table[i][j]:"";
                }
            }
            tableData.push(tmp);
        }
        oracleDao.query("SELECT count(*) FROM lg_base.V_SP_SHENQIN@TO_QYXX a, lg_base.V_SP_SHENPIFISH@TO_QYXX b where a.cust_name like '%"+search+"%' and a.ORIGINAl_SEQ = b.ORIGINAl_SEQ", function(data) {
            total = data["rows"][0];
            res.json({
                table:tableData,
                total:total
            });
        });
    });
});
router.get('/jg', function(req, res, next) {
    // [1,10]
    var p = 1, search = req.query.search.trim().split('').join("%");
    if (req.query.p) p = Number(req.query.p);
    var end = p*10;
    var total = 10002;
    oracleDao.query("select case_member,main_person,create_date,case_name,case_situation,unit_punish_money,legal_name FROM (SELECT A.*, ROWNUM RN FROM (SELECT * FROM lgsafe.case where case_member like '%"+search+"%' order by create_date desc) A WHERE ROWNUM <= " + end + ") WHERE RN > " + (end-10),
    function(result) {
        var table = result["rows"];
        var tableData = [], tmp = {};
        for (var i = 0; i < table.length; i++) {
            tmp = {};
            for (var j = 0; j < result["metaData"].length; j++) {
                if (result["metaData"][j]["name"] == "MONTH") {
                    tmp[result["metaData"][j]["name"]] = (table[i][j] != null)?table[i][j].toLocaleDateString():"";
                } else {
                    tmp[result["metaData"][j]["name"]] = (table[i][j] != null)?table[i][j]:"";
                }
            }
            tmp["CREATE_DATE"] = (function getDate(d) {
                var dd = new Date(d);
                return dd.getFullYear()+"年"+(dd.getMonth()+1)+"月"+dd.getDate()+"日"
                })(tmp["CREATE_DATE"]);
            tableData.push(tmp);
        }
        oracleDao.query("SELECT count(*) FROM lgsafe.case where case_member like '%"+search+"%'", function(data) {
            total = data["rows"][0];
            res.json({
                table:tableData,
                total:total
            });
        });
    });
});

router.get('/jbxx', function(req, res, next) {
    var name = req.query.name,
        total = 3,
        datas = {'用水用电':{}},
        renderData = function() {
            res.render('jbxx', {
                data:datas['jbxx'],
                xkz:datas['用水用电']
            });
        },
        index = 0;
    oracleDao.query("select clrq, czsj from EXDB.EX_GONGSHANG_41V2_SSZTJCXX where zch = '"+req.query.zch+"'",
    function(result) {
        datas['jbxx'] = result['rows'];
        if (++index == total) renderData();
    });
    oracleDao.query("select month, consumption from\
    WEBLH.T_ELECTRICITY where name = '"+name+"' and consumption != '0'\
    order by month desc\
    ", function(result) {
        if (result["rows"].length == 0) {
            if (++index == total) renderData();
            return;
        }
        var data = result["rows"], m, s = 0, d = 0;
        m = getMonthDate(data[0][0]);
        s = Number(data[0][1]);
        for (var i = 1; i < data.length; i++) {
            if (getMonthDate(data[i][0]) == m) {
                s += Number(data[i][1]);
            } else {
                if (!datas['用水用电'][m]) datas['用水用电'][m] = {};
                datas['用水用电'][m]['用电量']=s;
                m = getMonthDate(data[i][0]);
                s = Number(data[i][1]);
            }
        }
        if (++index == total) renderData();
    });
    oracleDao.query("select month, consumption from\
    WEBLH.T_WATER_NRESIDENT where name = '"+name+"' and consumption != '0'\
    order by month desc\
    ", function(result) {
        if (result["rows"].length == 0) {
            if (++index == total) renderData();
            return;
        }
        var data = result["rows"], m, s = 0, d = 0;
        m = getMonthDate(data[0][0]);
        s = Number(data[0][1]);
        for (var i = 1; i < data.length; i++) {
            if (getMonthDate(data[i][0]) == m) {
                s += Number(data[i][1]);
            } else {
                if (!datas['用水用电'][m]) datas['用水用电'][m] = {};
                datas['用水用电'][m]['用水量']=s;
                m = getMonthDate(data[i][0]);
                s = Number(data[i][1]);
            }
        }
        if (++index == total) renderData();
    });
});
router.get('/spxx', function(req, res, next) {
    var resultsData = {'许可证' : []},
        name = req.query.name,
        zch = req.query.zch,
        total = 5,
        renderDataY = function() {
            res.render('spxx', {
                data: resultsData['审批信息'],
                xkz:resultsData['许可证']
            });
        },
        index = 0;
    oracleDao.query("select * from\
                    (select a.control_seq, start_date, unit_name, approve_item, b.complete_date\
                    from lg_base.V_SP_SHENQIN@oanet37 a left join\
                    lg_base.V_SP_SHENPIFISH@oanet37 b on a.control_seq = b.control_seq\
                    where a.cust_name like '%"+name+"%'\
                    union all\
                    select a.ORIGINAl_SEQ, start_date, unit_name, approve_item, complete_date from lg_base.V_SP_SHENQIN@TO_QYXX a, lg_base.V_SP_SHENPIFISH@TO_QYXX b where a.ORIGINAl_SEQ = b.ORIGINAl_SEQ and a.cust_name like '%"+name+"%'\
                    )\
                    order by start_date desc\
                    ",
    function(result) {
        var data = result["rows"];
        resultsData['审批信息'] = data;
        if (++index == total) renderDataY();
    });
    oracleDao.query("select '环保许可证', LICENSENUMBER, POLLUTIONTYPE, '广州开发区建设和环境保护局',  REGEXP_SUBSTR(LICENSEVALIDITY,'[^至]+',1,1,'i'),REGEXP_SUBSTR(LICENSEVALIDITY,'[^至]+',1,2,'i'),''\
    from SA.T_YYYD_XKZ_MAIN where entername = '"+name+"'\
    ", function(result) {
        var data = result["rows"];
        resultsData['许可证'] = resultsData['许可证'].concat(data);
        if (++index == total) renderDataY();
    });
    oracleDao.query("select '食品经营许可',xkzbh,jyxm_zw,creator_partname,xkksrq,xkjsrq,'' from lgyj_xdr.b_xdr_sp_jy_zsxx\
    where qymc like '%"+name+"%'\
    ", function(result) {
        var data = result["rows"];
        resultsData['许可证'] = resultsData['许可证'].concat(data);
        if (++index == total) renderDataY();
    });
    oracleDao.query("select '化妆品许可',xkzbh,pzscxm,'市场局',to_char(create_time,'yyyy-mm-dd'),to_char(yxq,'yyyy-mm-dd'),'' from lgyj_xdr.b_xdr_hzp_fac_zsxx\
    where qymc like '%"+name+"%'\
    ", function(result) {
        var data = result["rows"];
        resultsData['许可证'] = resultsData['许可证'].concat(data);
        if (++index == total) renderDataY();
    });
    oracleDao.query("select credentials_name,credentials_code,licenses_range,award_unit, to_char(award_date,'yyyy-mm-dd'),to_char(valid_end,'yyyy-mm-dd') ,'' from lgsafe.corp_credentials\
    where CORP_NAME like '%"+name+"%'\
    ", function(result) {
        var data = result["rows"];
        resultsData['许可证'] = resultsData['许可证'].concat(data);
        if (++index == total) renderDataY();
    });
});
router.get('/spxxitem', function(req, res, next) {
    var id = req.query.id;
    oracleDao.query("\
    select APPROVE_ITEM, CUST_CONTACT_PERSON,CUST_CONTACT_WAY,CUST_ADDR,CUST_MOBILE,start_man,start_date,UNIT_NAME,complete_man,complete_date\
    from lg_base.V_SP_SHENQIN@oanet37 a left join\
        lg_base.V_SP_SHENPIFISH@oanet37 b on a.control_seq = b.control_seq\
    where a.control_seq = '"+id+"'\
    union all\
    select APPROVE_ITEM, CUST_CONTACT_PERSON,CUST_CONTACT_WAY,CUST_ADDR,CUST_MOBILE,start_man,start_date,UNIT_NAME,complete_man,complete_date from lg_base.V_SP_SHENQIN@TO_QYXX a, lg_base.V_SP_SHENPIFISH@TO_QYXX b where a.ORIGINAl_SEQ = b.ORIGINAl_SEQ\
    and a.original_seq = '"+id+"'\
    ", function(result) {
        var data = result["rows"];
        for (item of data) {
            item[6] = getDate(item[6]);
            item[9] = getDate(item[9]);
        }
        res.render('spxxitem', {
            title:'广州开发区审批监管大数据平台',
            data:data
        });
    });
});
router.get('/jwxx', function(req, res, next) {
    oracleDao.query("\
    select to_char(ywid), startdate, '区建设和环境保护局', '日常巡查', 'sa.T_YYYD_ZF_MAIN', 'ywid' ,'0'\
    from (select * from sa.T_YYYD_ZF_MAIN where unitname like '%"+req.query.name+"%'\
    order by startdate desc)\
    union all\
    select to_char(ywid), starttime, '区建设和环境保护局', '行政处罚', 'sa.T_YYYD_LA_MAIN', 'ywid','1' \
    from (select * from sa.T_YYYD_LA_MAIN where PARTY like '%"+req.query.name+"%'\
    order by starttime desc)\
    union all\
    select uuid, check_time_start,'区安全生产监督管理局', '日常巡查', 'lgsafe.site_check_record', 'uuid', '0' \
    from (select * from lgsafe.site_check_record where corp_name like '%"+req.query.name+"%'\
    order by check_time_start desc)\
    union all\
    select uuid, create_date,'区安全生产监督管理局', '行政处罚' ,'lgsafe.case', 'uuid' ,'1'\
    from (select * from lgsafe.case where case_member like '%"+req.query.name+"%'\
    order by create_date desc)\
    union all\
    select id, jcjssj, '区市场质量监督管理局', '日常巡查', 'LGYJ_CYJG.B_CY_RC_J_XCJC', 'id' ,'0' from (select * \
    from LGYJ_CYJG.B_CY_RC_J_XCJC where jcqymc like '%"+req.query.name+"%'\
    order by jcjssj desc)\
    union all\
    select to_char(id), start_time , '区劳动和社会保障局', '日常巡查', 'ldzf.QY_RCXC_REAL', 'id' ,'0' \
    from (select * from ldzf.QY_RCXC_REAL where qy_name like '%"+req.query.name+"%'\
    order by start_time desc)\
    ",
    function(result) {
        res.render('jwxx', {
            data:result["rows"]
        });
    });
});
// 完成：环保日常，安监日常
var tableNames = {
    'lgsafe.case':"legal_name,case_name,'安全生产监督管理局',case_source,to_char(case_time,'yyyy-mm-dd'),MAIN_PERSON,MAIN_PERSON_PAPER,'','','','','','',UNIT_PUNISH_MONEY,''",
    'sa.T_YYYD_ZF_MAIN':"to_char(startdate,'yyyy-mm-dd'), undertakedepartment, QDLX, researchman, '', zflx, '', ''",
    'sa.T_YYYD_LA_MAIN':"party, '', UNDERTAKEDEPART, NAME, to_char(STARTTIME,'yyyy-mm-dd'), UNDERTAKEMAN, '','','','','',PUNISHADVICE,'',PUNISHCONTENT,''",
    'ldzf.QY_RCXC_REAL':"to_char(start_time,'yyyy-mm-dd'), '劳动局', '日常巡查', main_man||','||ass_man, '', to_char(CONTENT), to_char(question),''",
    'lgsafe.site_check_record':"to_char(a.check_time_start,'yyyy-mm-dd'),a.SAFETY_DEPT_NAME,'日常检查', a.check_man, a.CHECK_MAN1_CODE, b.risk_contain, '' ,''",
    'LGYJ_CYJG.B_CY_RC_J_XCJC':"to_char(JCJSSJ,'yyyy-mm-dd'), '市场局', '日常巡查', zfrqm,jcqy_ssxq,'卫生',to_char(spjcjl),''"
};
var tableDict = {
    "lgsafe.site_check_record":"lgsafe.site_check_record a \
                                left join \
                                lgsafe.check_record_item b\
                                on a.uuid = b.check_uuid"
}
router.get('/item', function(req, res, next) {
    var table = req.query.t,
        name = req.query.n,
        id = req.query.id,
        type = req.query.type,
        index = {};

    oracleDao.query("select "+tableNames[table]+" from "+(tableDict[table]?tableDict[table]:table)+" where "+(tableDict[table]?"a.":"")+name+"= '"+id+"'",
    function(result) {
        
        res.render('item', {
             title:'广州开发区审批监管大数据平台',
             table:result["rows"][0],
             type:type
        });
    });
});
router.get('/jgs', function(req, res, next) {
    var p = req.query.p,
        search = req.query.search.trim().split('').join("%"),
        resultData = {
            table:undefined,
            total:undefined
        },
        name = req.query.n,
        index = {},
        renderData = function() {
            if (resultData["table"] && resultData["total"])
                res.json({
                    table:resultData["table"],
                    total:resultData["total"]
                });
        }
    if (name === 'aj') {
        oracleDao.query("select to_char(check_time_start,'yyyy-mm-dd'), CORP_NAME,'日常检查', check_man, CHECK_MAN1_CODE, risk_contain, '' ,''\
        from (select rownum rn, a.*, b.*\
        from (select * from lgsafe.site_check_record where CORP_NAME like '%" + search + "%' order by check_time_start desc) a\
        left join\
        lgsafe.check_record_item b\
        on a.uuid = b.check_uuid\
        where rownum <= "+(p*10)+")\
        where rn >= "+(p*10-9),function(result) {
            resultData["table"] = result["rows"];
            renderData();
        });
        oracleDao.query("select count(*) from lgsafe.site_check_record where CORP_NAME like '%" + search + "%' \
            ",function(result) {
            resultData["total"] = result["rows"][0];
            renderData();
        });
    } else if (name === 'sc') {
        oracleDao.query("select to_char(JCJSSJ,'yyyy-mm-dd'), JCQYMC, '日常巡查', zfrqm,jcqy_ssxq,'卫生',to_char(spjcjl),''\
        from (select rownum rn, a.*\
        from (select * from LGYJ_CYJG.B_CY_RC_J_XCJC where JCQYMC like '%"+search+"%' order by jcjssj desc) a\
        where rownum <= "+(p*10)+")\
        where rn >= "+(p*10-9),function(result) {
            resultData["table"] = result["rows"];
            renderData();
        });
        oracleDao.query("select count(*) from LGYJ_CYJG.B_CY_RC_J_XCJC where JCQYMC like '%"+search+"%' \
            ",function(result) {
            resultData["total"] = result["rows"][0];
            renderData();
        });
    } else if (name === 'lj') {
        oracleDao.query("select to_char(start_time,'yyyy-mm-dd'), QY_NAME, '日常巡查', main_man||','||ass_man, '', to_char(CONTENT), to_char(question),''\
        from (select rownum rn, a.*\
        from (select * from ldzf.QY_RCXC_REAL where QY_NAME like '%"+search+"%' order by start_time desc) a\
        where rownum <= "+(p*10)+")\
        where rn >= "+(p*10-9),function(result) {
            resultData["table"] = result["rows"];
            renderData();
        });
        oracleDao.query("select count(*) from ldzf.QY_RCXC_REAL where QY_NAME like '%"+search+"%'\
            ",function(result) {
            resultData["total"] = result["rows"][0];
            renderData();
        });
    } else if (name === 'hb') {
        oracleDao.query("select to_char(startdate,'yyyy-mm-dd'), unitname, QDLX, researchman, '', zflx, '', ''\
        from (select rownum rn, a.*\
        from (select * from sa.T_YYYD_ZF_MAIN where UNITNAME like '%"+search+"%' order by startdate desc) a\
        where rownum <= "+(p*10)+")\
        where rn >= "+(p*10-9),function(result) {
            resultData["table"] = result["rows"];
            renderData();
        });
        oracleDao.query("select count(*) from sa.T_YYYD_ZF_MAIN where UNITNAME like '%"+search+"%'\
            ",function(result) {
            resultData["total"] = result["rows"][0];
            renderData();
        });
    }
});
module.exports = router;