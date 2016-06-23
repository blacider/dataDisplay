// dao/dataDao.js
// 实现与Oracle交互
var mysql = require('mysql');
var $conf = require('../conf/db');
var $util = require('../util/util');
var sql = {
  queryByNameInLDJG: 'select * from LDZF_CASE where UNIT_QY_NAME LIKE N\'%',

  queryByNameInAQJG: 'select * from LGSAFE_CASE where CASE_MEMBER LIKE N\'%',

  queryByNameInHBJG: 'select * from T_YYYD_LA_MAIN where UNDERTAKEMAN LIKE N\'%',

  queryByNameInSYJG: 'select * from B_CY_RC_J_XCJC where JCQYMC LIKE N\'%',
  
  queryByNameInDF: 'select * from T_ELECTRICITY where NAME LIKE N\'%',

  queryByNameInSF: 'select * from T_WATER_NRESIDENT where NAME LIKE N\'%',

  queryByNameInSP: 'select * from V_LZCITY_APPROVE_CONTROL_INFO where CUST_NAME LIKE N\'%',

  queryByNameInGS: 'select * from SSDJ_JBXX where MC LIKE N\'%'
};

var pool  = mysql.createPool($util.extend({}, $conf.mysql));

var eachPageItemCount = 10;
module.exports = {
    queryAllByConName: function(enterpriseName, callback) {
        var status = 0, max = 7, results = [], tempresults = [];
            pool.getConnection(function(err, connection) {
              for(item in sql) {
                connection.query(sql[item]+enterpriseName+'%\'', function(err,result) {
                     //console.log(sql[item]+enterpriseName+'%\'');
                     if (result) {
                      if(result.length != 0) {
                        results = results.concat(result);
                        for (var iiii = 0; iiii < result.length; iiii++) {
                        temp = result[iiii];
                        switch(status) {
                          case 0:
                            object = {
                              name: temp['UNIT_QY_NAME'],
                              people: temp['UNIT_LEGAL'],
                              address: temp['UNIT_ADDR']
                            }
                            tempresults.push(object);
                            break;

                          case 1 :
                            object = {
                              name: temp['CASE_MEMBER'],
                              people: temp['LEGAL_NAME'],
                              address: ''
                            }
                            tempresults.push(object);
                            break;

                          case 2 :
                            object = {
                              name: temp['PARTY'],
                              people: '',
                              address: ''
                            }
                            tempresults.push(object);
                            break;

                          case 3 :
                            object = {
                              name: temp['JCQYMC'],
                              people: temp['DSRQM'],
                              address: temp['JCDD']
                            }
                            tempresults.push(object);
                            break;

                          case 4 :
                            object = {
                              name: temp['NAME'],
                              people: '',
                              address: temp['ADDRESS']
                            }
                            tempresults.push(object);
                            break;

                          case 5 :
                            object = {
                              name: temp['NAME'],
                              people: '',
                              address: ''
                            }
                            tempresults.push(object);
                            break;

                          case 6 :
                            object = {
                              name: temp['CUST_NAME'],
                              people: temp['CUST_CONTACT_PERSON'],
                              address: ''
                            }
                            tempresults.push(object);
                            break;

                          case 7 :
                            object = {
                              name: temp['MC'],
                              people: temp['FDDBR'],
                              address: temp['DZ']
                            }
                            tempresults.push(object);
                            break;
                          case 'default' :
                            break;
                        }
                      }
                        console.log(tempresults);
                      }
                    }


                    if (status == max-1) {
                        status += 1;


                        callback(err, tempresults);
                        connection.release();
                    } else {
                        status = status+1;
                    }
                });
              }
        });
    }
};