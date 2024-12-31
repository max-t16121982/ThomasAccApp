//704@LinoWelcome

const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 8081;
app.use(cors());
app.use(bodyParser.json());
// var ip = ''
// var port = ''
// const db = mysql.createConnection({
//     host: "103.206.139.246",
//     user: "root", 
//     password: '704@LinoWelcome',
//     port: "3310", 
//     database: "sas20232024"
// })

app.post('/connect', (req, res) => {
    // ip = req.body.ipaddress
    // port = req.body.port
    // console.log(req.body)
    // console.log(req.body.ipaddress)
    // console.log(req.body.port)
    const db = mysql.createConnection({
        host: req.body.ipaddress,
        user: "root",
        password: '704@LinoWelcome',
        port: req.body.port,
        database: "defaultsas"
    })
    try {
        const sql = "SELECT COAYEAR, DATABASENME FROM `existedcompanyinfo` " +
            " GROUP BY COAYEAR, DATABASENME " +
            " ORDER BY COAYEAR DESC"
        db.query(sql, (err, data) => {
            if (err) return res.json(err);
            return res.json(data);
        })

    } catch (e) {
        console.log(e)
    }
})

//
app.post('/ag_sas', (req, res) => {
    const frmdt = req.body.fromdate
    const todt = req.body.todate
    const accid = req.body.accid
    const refaccid = req.body.refaccid
    const comid = req.body.comid
    const pend = (req.body.pending == false ? 0 : 1)

    const db = mysql.createConnection({
        host: req.body.ipaddress,
        user: "root",
        password: '704@LinoWelcome',
        port: req.body.port,
        database: req.body.database
    })
    try {
        const strfilter = (pend == 1 ? " AND IFNULL(sas_agency.tallied,0) = 1 " : "")
        const strRefAccfilter = (refaccid != "" ? " AND accountmaster.trnasid = '" + refaccid + "'" : "")
        const sql = " Select  CONCAT( SUBSTRING_INDEX(sas_agency.`AcYear`,'-', 1) , '-' , '04' , '-' , '01') start_date, " +
            " CONCAT(SUBSTRING_INDEX(sas_agency.`AcYear`,'-', -1),'-','03','-','31') end_date, " +
            " Concat(Ifnull(a.actype,''),Ifnull(a.actypegrpid,'')) AS gp, " +
            " 'Opening'                                            AS refacname, " +
            " ''                                                      coname, " +
            " ''                                                      coshtname, " +
            " Concat(a.acname,' [', a.accode ,'] ',( " +
            "                 CASE " +
            "                                 WHEN Ifnull(a.acpan,'') <> '' THEN Concat(' PAN ',Ifnull(a.acpan,'')) " +
            "                                 Else '' " +
            " End), ( " +
            "                 Case " +
            "                                 WHEN Ifnull(a.cityname,'') <> '' THEN Concat(' ',Ifnull(a.cityname,'')) " +
            "                                 Else '' " +
            " End))                                           As account,  " +
            "                 a.trnasid  accid, " +
            "                 Concat(Ifnull(a.acflatno,''),' ',Ifnull(a.acstreetrd,''),' ',Ifnull(a.acothers,''),' ', Ifnull(a.cityname,''))    address,     " +
            "                 a.acflatno  address1,    " +
            "                 a.acstreetrd address2,    " +
            "                 a.acothers address3,    " +
            "                 Ifnull(a.cityname,'') cityname,    " +
            "                 a.`acpan`, " +
            "                 0  As comid,  " +
            "                 companymaster.coayear AS coacyear, " +
            "                 '' AS grpacname, " +
            "                 '' AS brokername, " +
            "                 0 trnasid, " +
            "                 0 voucherno, " +
            "                 '' bill, " +
            "                 '' tallied, " +
            "                 '' partystatus, " +
            "                 0  refactrnasid," +
            "                 Case " +
            "                                 WHEN sum(sas_agency.dramount) - sum(sas_agency.cramount) > 0 THEN sum(sas_agency.dramount) - sum(sas_agency.cramount) " +
            "                                 Else 0 " +
            "                 End dramount, " +
            "                 Case " +
            "                                 WHEN sum(sas_agency.dramount) - sum(sas_agency.cramount) < 0 THEN sum(sas_agency.cramount) - sum(sas_agency.dramount)                                      " +
            "                                 Else 0                                                                                                                         " +
            "                 End                                                                cramount,                                                                   " +
            "                 ''                                                                 menutype,                                                                   " +
            "                 cast(" + frmdt + " AS date) acdate,                                                                     " +
            "                 0                                                                  paydays,                                                                    " +
            "                 ''                                                                 chequeno,                                                                   " +
            " ''                                                                 chequedate,                                                                                 " +
            " 0                                                                  rectype,                                                                                    " +
            "                 0                                                                  totalpcs,                                                                   " +
            "                 0                                                                  totalqty,                                                                   " +
            "                 0                                                                  lessqty,                                                                    " +
            "                 ''                                                                 remark,                                                                     " +
            "                 0                                                                  slips,                                                                      " +
            "                 ''                                                                 postingdate,                                                                " +
            "                 ''                                                                 clearingdate,                                                               " +
            "                 0                                                                  eptid,                                                                      " +
            "                 sas_agency.acyear,                                                                                                                                    " +
            "                 sas_agency.actrnasid,                                                                                                                                 " +
            "                 cast(concat('+ " + frmdt + " + ', ' to ','+ " + todt + " + ') AS char)    periodof,     " +
            "                 cast(concat('+ CDate(" + frmdt + ").ToString(yyyy) + 1+ ', '-','+ CDate(" + todt + ").ToString(yyyy) + 1+ ') AS        char)    asseyear,     " +
            "                 b.coname                                                                                                                              As company,      " +
            "                 b.destination                                                                                                                            signatures,   " +
            "                 b.coperson                                                                                                                               person,       " +
            "                 ''                                                                                                                                       remarks,      " +
            "                 ''                                                                                                                                       narration,    " +
            " Case                                                                                                                                                                   " +
            "                                 WHEN sum(sas_agency.dramount) - sum(sas_agency.cramount) > 0 THEN 1                                                                                  " +
            "                                 Else 0                                                                                                                                 " +
            "                 End code                                                                                                                                               " +
            " FROM            sas_agency                                                                                                                                                    " +
            " LEFT JOIN       accountmaster                                                                                                                                          " +
            " On              (                                                                                                                                                      " +
            "                                 sas_agency.refactrnasid = accountmaster.trnasid)                                                                                              " +
            " LEFT JOIN       companymaster                                                                                                                                          " +
            " On              (                                                                                                                                                      " +
            "                                 sas_agency.companyid = companymaster.trnasid)                                                                                                 " +
            " LEFT OUTER JOIN accountmaster groupacmatr                                                                                                                              " +
            " On              (                                                                                                                                                      " +
            "                                 sas_agency.refgcode = groupacmatr.trnasid)                                                                                                    " +
            " LEFT OUTER JOIN accountmaster a                                                                                                                                        " +
            " On              a.trnasid = sas_agency.actrnasid                                                                                                                              " +
            " LEFT OUTER JOIN accountmaster brokeracmastr                                                                                                                            " +
            " On              (                                                                                                                                                      " +
            "                                 sas_agency.bcd = brokeracmastr.trnasid)                                                                                                       " +
            " LEFT JOIN       companymaster b                                                                                                                                        " +
            " On              (                                                                                                                                                      " +
            "                                1 = b.trnasid)                                                                                                                          " +
            " WHERE                                                                                                                                                                  " +
            " Case                                                                                                                                                                   " +
            "                                 WHEN sas_agency.billid = -100 THEN date_sub(sas_agency.acdate,interval 1 day)                                                                        " +
            "                                 Else sas_agency.acdate                                                                                                                        " +
            "                 End < '" + frmdt + "' " +
            " AND a.trnasid = " + accid +
            " AND companymaster.trnasid = " + comid +
            strRefAccfilter + strfilter +
            " 		GROUP BY        a.acname,                                                                                                                                        " +
            "                 sas_agency.actrnasid                                                                                                                                          " +
            " HAVING                                                                                                                                                                 " +
            " Case                                                                                                                                                                   " +
            "                                 WHEN sum(sas_agency.dramount) - sum(sas_agency.cramount) < 0 THEN sum(sas_agency.cramount) - sum(sas_agency.dramount)                                              " +
            "                                 Else sum(sas_agency.dramount) - sum(sas_agency.cramount)                                                                                             " +
            "                 End <> 0                                                                                                                                               " +
            " And             sum(sas_agency.dramount) - sum(sas_agency.cramount) <> 0                                                                                                             " +
            " UNION ALL                                                                                                                                                              " +
            " Select CONCAT( SUBSTRING_INDEX(sas_agency.`AcYear`,'-', 1) , '-' , '04' , '-' , '01') start_date, " +
            " CONCAT(SUBSTRING_INDEX(sas_agency.`AcYear`,'-', -1),'-','03','-','31') end_date, " +
            " concat(ifnull(a.actype,''),ifnull(a.actypegrpid,'')) AS gp,                                                                                                     " +
            "                 cast(accountmaster.acname As Char)                   As refacname,                                                                                     " +
            "                 companymaster.coname,                                                                                                                                  " +
            "                 companymaster.coshtname,                                                                                                                               " +
            "                                 concat(a.acname,' [', a.accode ,'] ', (                                                                                                " +
            "                 CASE                                                                                                                                                   " +
            "                                 WHEN ifnull(a.acpan,'') <> '' THEN concat(' PAN ',ifnull(a.acpan,''))                                                                  " +
            "                                 Else ''                                                                                                                                " +
            " End), (                                                                                                                                                                " +
            "                 Case                                                                                                                                                   " +
            "                                 WHEN ifnull(a.cityname,'') <> '' THEN concat(' ',ifnull(a.cityname,''))                                                                " +
            "                                 Else ''                                                                                                                                " +
            " End))                                                                                                                          As account,                             " +
            "                 a.trnasid                                                                                                                         accid,               " +
            "                                 concat(ifnull(a.acflatno,''),' ',ifnull(a.acstreetrd,''),' ',ifnull(a.acothers,''),' ', ifnull(a.cityname,''))    address,             " +
            "                 a.acflatno                                                                                                                        address1,            " +
            "                 a.acstreetrd                                                                                                                      address2,            " +
            "                 a.acothers                                                                                                                        address3,            " +
            "                 ifnull(a.cityname,'')                                                                                                             cityname,            " +
            "                 a.`acpan`,                                                                                                                                             " +
            "                 companymaster.trnasid As comid,                                                                                                                        " +
            "                 companymaster.coayear AS coacyear,                                                                                                                     " +
            "                 groupacmatr.acname    As grpacname,                                                                                                                    " +
            "                 brokeracmastr.acname  AS brokername,                                                                                                                   " +
            "                 sas_agency.trnasid,                                                                                                                                           " +
            "                 sas_agency.voucherno,                                                                                                                                         " +
            "                 CASE                                                                                                                                                   " +
            "                                 WHEN ifnull(sas_agency.bill,'') = '' THEN ifnull(sas_agency.chequeno,'')                                                                             " +
            "                                 Else ifnull(sas_agency.bill,'')                                                                                                               " +
            "                 End bill,                                                                                                                                              " +
            "                 sas_agency.tallied,                                                                                                                                           " +
            "                 sas_agency.partystatus,                                                                                                                                       " +
            "                 sas_agency.refactrnasid,                                                                                                                                      " +
            "                 sas_agency.dramount,                                                                                                                                          " +
            "                 sas_agency.cramount,                                                                                                                                          " +
            "                 sas_agency.menutype,                                                                                                                                          " +
            "                 sas_agency.acdate,                                                                                                                                            " +
            "                 sas_agency.paydays,                                                                                                                                           " +
            "                 sas_agency.chequeno,                                                                                                                                          " +
            "                 sas_agency.chequedate,                                                                                                                                        " +
            "                 sas_agency.rectype,                                                                                                                                           " +
            "                 sas_agency.totalpcs,                                                                                                                                          " +
            "                 sas_agency.totalqty,                                                                                                                                          " +
            "                 sas_agency.lessqty,                                                                                                                                           " +
            "                 sas_agency.remarks,                                                                                                                                           " +
            "                 sas_agency.slips,                                                                                                                                             " +
            "                 sas_agency.postingdate,                                                                                                                                       " +
            "                 ifnull(cast(sas_agency.clearingdate As Char),'') clearingdate,                                                                                                " +
            "                 sas_agency.eptid,                                                                                                                                             " +
            "                 sas_agency.acyear,                                                                                                                                            " +
            "                 sas_agency.actrnasid,                                                                                                                                         " +
            "                 cast(concat('+ CDate(" + frmdt + ").ToString(dd-MM-yyyy)+ ', ' to ','+ CDate(" + todt + ").ToString(dd-MM-yyyy)+ ') AS char)    periodof,     " +
            "                 cast(concat('+ CDate(" + frmdt + ").ToString(yyyy) + 1+ ', '-','+ CDate(" + todt + ").ToString(yyyy) + 1+ ') AS        char)    asseyear,     " +
            "                 b.coname                                                                                                                              As company,      " +
            "                 b.destination                                                                                                                            signatures,   " +
            "                 b.coperson                                                                                                                               person,       " +
            "                 ''                                                                                                                                       remarks,      " +
            " ifnull(sas_agency.`remarks`,'')                                                                                                                 narration,                    " +
            "                 CASE                                                                                                                                                   " +
            "                                 WHEN sas_agency.dramount > 0 THEN 1 " +
            "                                 Else 0 " +
            "                 End code " +
            " FROM            sas_agency " +
            " LEFT JOIN       accountmaster " +
            " On              ( " +
            "                                 sas_agency.refactrnasid = accountmaster.trnasid) " +
            " LEFT JOIN       companymaster " +
            " On              ( " +
            "                                 sas_agency.companyid = companymaster.trnasid) " +
            " LEFT OUTER JOIN accountmaster groupacmatr " +
            " On              ( " +
            "                                 sas_agency.refgcode = groupacmatr.trnasid) " +
            " LEFT OUTER JOIN accountmaster a " +
            " On              ( " +
            "                                 a.trnasid = sas_agency.actrnasid) " +
            " LEFT OUTER JOIN accountmaster brokeracmastr " +
            " On              ( " +
            "                                 sas_agency.bcd = brokeracmastr.trnasid) " +
            " LEFT JOIN       companymaster b " +
            " On              ( " +
            "                                 sas_agency.CompanyID = b.trnasid) " +
            " WHERE           sas_agency.billid <> -100 " +
            " And             sas_agency.acdate BETWEEN '" + frmdt + "' And '" + todt + "' " +
            " AND a.trnasid = " + accid +
            " AND companymaster.trnasid = " + comid +
            strRefAccfilter + strfilter + " ORDER BY         15, 37, 28, 21 " //5, 26, 18, 22, 14; ";
        //console.log(sql)
        //const sql = "select * from sas";    
        db.query(sql, (err, data) => {
            if (err) return res.json(err);
            return res.json(data);
        })
    } catch (e) {
        console.log(e)
    }
})

app.post('/sas', (req, res) => {
    // console.log(1)
    // console.log(req.body)
    // console.log(req.body.ipaddress)
    // console.log(req.body.port)
    // console.log(2)
    const frmdt = req.body.fromdate
    const todt = req.body.todate
    const accid = req.body.accid
    const comid = req.body.comid
    const pend = (req.body.pending == false ? 0 : 1)

    const db = mysql.createConnection({
        host: req.body.ipaddress,
        user: "root",
        password: '704@LinoWelcome',
        port: req.body.port,
        database: req.body.database
    })

    try {
        const strfilter = (pend == 1 ? " AND IFNULL(sas.tallied,0) = 1 " : "")
        const sql = " Select  CONCAT( SUBSTRING_INDEX(sas.`AcYear`,'-', 1) , '-' , '04' , '-' , '01') start_date, " +
            " CONCAT(SUBSTRING_INDEX(sas.`AcYear`,'-', -1),'-','03','-','31') end_date, " +
            " Concat(Ifnull(a.actype,''),Ifnull(a.actypegrpid,'')) AS gp, " +
            " 'Opening'                                            AS refacname, " +
            " ''                                                      coname, " +
            " ''                                                      coshtname, " +
            " Concat(a.acname,' [', a.accode ,'] ',( " +
            "                 CASE " +
            "                                 WHEN Ifnull(a.acpan,'') <> '' THEN Concat(' PAN ',Ifnull(a.acpan,'')) " +
            "                                 Else '' " +
            " End), ( " +
            "                 Case " +
            "                                 WHEN Ifnull(a.cityname,'') <> '' THEN Concat(' ',Ifnull(a.cityname,'')) " +
            "                                 Else '' " +
            " End))                                           As account,  " +
            "                 a.trnasid  accid, " +
            "                 Concat(Ifnull(a.acflatno,''),' ',Ifnull(a.acstreetrd,''),' ',Ifnull(a.acothers,''),' ', Ifnull(a.cityname,''))    address,     " +
            "                 a.acflatno  address1,    " +
            "                 a.acstreetrd address2,    " +
            "                 a.acothers address3,    " +
            "                 Ifnull(a.cityname,'') cityname,    " +
            "                 a.`acpan`, " +
            "                 0  As comid,  " +
            "                 companymaster.coayear AS coacyear, " +
            "                 '' AS grpacname, " +
            "                 '' AS brokername, " +
            "                 0 trnasid, " +
            "                 0 voucherno, " +
            "                 '' bill, " +
            "                 '' tallied, " +
            "                 '' partystatus, " +
            "                 0  refactrnasid," +
            "                 Case " +
            "                                 WHEN sum(sas.dramount) - sum(sas.cramount) > 0 THEN sum(sas.dramount) - sum(sas.cramount) " +
            "                                 Else 0 " +
            "                 End dramount, " +
            "                 Case " +
            "                                 WHEN sum(sas.dramount) - sum(sas.cramount) < 0 THEN sum(sas.cramount) - sum(sas.dramount)                                      " +
            "                                 Else 0                                                                                                                         " +
            "                 End                                                                cramount,                                                                   " +
            "                 ''                                                                 menutype,                                                                   " +
            "                 cast(" + frmdt + " AS date) acdate,                                                                     " +
            "                 0                                                                  paydays,                                                                    " +
            "                 ''                                                                 chequeno,                                                                   " +
            " ''                                                                 chequedate,                                                                                 " +
            " 0                                                                  rectype,                                                                                    " +
            "                 0                                                                  totalpcs,                                                                   " +
            "                 0                                                                  totalqty,                                                                   " +
            "                 0                                                                  lessqty,                                                                    " +
            "                 ''                                                                 remark,                                                                     " +
            "                 0                                                                  slips,                                                                      " +
            "                 ''                                                                 postingdate,                                                                " +
            "                 ''                                                                 clearingdate,                                                               " +
            "                 0                                                                  eptid,                                                                      " +
            "                 sas.acyear,                                                                                                                                    " +
            "                 sas.actrnasid,                                                                                                                                 " +
            "                 cast(concat('+ " + frmdt + " + ', ' to ','+ " + todt + " + ') AS char)    periodof,     " +
            "                 cast(concat('+ CDate(" + frmdt + ").ToString(yyyy) + 1+ ', '-','+ CDate(" + todt + ").ToString(yyyy) + 1+ ') AS        char)    asseyear,     " +
            "                 b.coname                                                                                                                              As company,      " +
            "                 b.destination                                                                                                                            signatures,   " +
            "                 b.coperson                                                                                                                               person,       " +
            "                 ''                                                                                                                                       remarks,      " +
            "                 ''                                                                                                                                       narration,    " +
            " Case                                                                                                                                                                   " +
            "                                 WHEN sum(sas.dramount) - sum(sas.cramount) > 0 THEN 1                                                                                  " +
            "                                 Else 0                                                                                                                                 " +
            "                 End code                                                                                                                                               " +
            " FROM            sas                                                                                                                                                    " +
            " LEFT JOIN       accountmaster                                                                                                                                          " +
            " On              (                                                                                                                                                      " +
            "                                 sas.refactrnasid = accountmaster.trnasid)                                                                                              " +
            " LEFT JOIN       companymaster                                                                                                                                          " +
            " On              (                                                                                                                                                      " +
            "                                 sas.companyid = companymaster.trnasid)                                                                                                 " +
            " LEFT OUTER JOIN accountmaster groupacmatr                                                                                                                              " +
            " On              (                                                                                                                                                      " +
            "                                 sas.refgcode = groupacmatr.trnasid)                                                                                                    " +
            " LEFT OUTER JOIN accountmaster a                                                                                                                                        " +
            " On              a.trnasid = sas.actrnasid                                                                                                                              " +
            " LEFT OUTER JOIN accountmaster brokeracmastr                                                                                                                            " +
            " On              (                                                                                                                                                      " +
            "                                 sas.bcd = brokeracmastr.trnasid)                                                                                                       " +
            " LEFT JOIN       companymaster b                                                                                                                                        " +
            " On              (                                                                                                                                                      " +
            "                                sas.companyid = b.trnasid)                                                                                                                          " +
            " WHERE                                                                                                                                                                  " +
            " Case                                                                                                                                                                   " +
            "                                 WHEN sas.billid = -100 THEN date_sub(sas.acdate,interval 1 day)                                                                        " +
            "                                 Else sas.acdate                                                                                                                        " +
            "                 End < '" + frmdt + "' " +
            " AND a.trnasid = " + accid +
            " AND companymaster.trnasid = " + comid +
            strfilter +
            " 		GROUP BY        a.acname,                                                                                                                                        " +
            "                 sas.actrnasid                                                                                                                                          " +
            " HAVING                                                                                                                                                                 " +
            " Case                                                                                                                                                                   " +
            "                                 WHEN sum(sas.dramount) - sum(sas.cramount) < 0 THEN sum(sas.cramount) - sum(sas.dramount)                                              " +
            "                                 Else sum(sas.dramount) - sum(sas.cramount)                                                                                             " +
            "                 End <> 0                                                                                                                                               " +
            " And             sum(sas.dramount) - sum(sas.cramount) <> 0                                                                                                             " +
            " UNION ALL                                                                                                                                                              " +
            " Select CONCAT( SUBSTRING_INDEX(sas.`AcYear`,'-', 1) , '-' , '04' , '-' , '01') start_date, " +
            " CONCAT(SUBSTRING_INDEX(sas.`AcYear`,'-', -1),'-','03','-','31') end_date, " +
            " concat(ifnull(a.actype,''),ifnull(a.actypegrpid,'')) AS gp,                                                                                                     " +
            "                 cast(accountmaster.acname As Char)                   As refacname,                                                                                     " +
            "                 companymaster.coname,                                                                                                                                  " +
            "                 companymaster.coshtname,                                                                                                                               " +
            "                                 concat(a.acname,' [', a.accode ,'] ', (                                                                                                " +
            "                 CASE                                                                                                                                                   " +
            "                                 WHEN ifnull(a.acpan,'') <> '' THEN concat(' PAN ',ifnull(a.acpan,''))                                                                  " +
            "                                 Else ''                                                                                                                                " +
            " End), (                                                                                                                                                                " +
            "                 Case                                                                                                                                                   " +
            "                                 WHEN ifnull(a.cityname,'') <> '' THEN concat(' ',ifnull(a.cityname,''))                                                                " +
            "                                 Else ''                                                                                                                                " +
            " End))                                                                                                                          As account,                             " +
            "                 a.trnasid                                                                                                                         accid,               " +
            "                                 concat(ifnull(a.acflatno,''),' ',ifnull(a.acstreetrd,''),' ',ifnull(a.acothers,''),' ', ifnull(a.cityname,''))    address,             " +
            "                 a.acflatno                                                                                                                        address1,            " +
            "                 a.acstreetrd                                                                                                                      address2,            " +
            "                 a.acothers                                                                                                                        address3,            " +
            "                 ifnull(a.cityname,'')                                                                                                             cityname,            " +
            "                 a.`acpan`,                                                                                                                                             " +
            "                 companymaster.trnasid As comid,                                                                                                                        " +
            "                 companymaster.coayear AS coacyear,                                                                                                                     " +
            "                 groupacmatr.acname    As grpacname,                                                                                                                    " +
            "                 brokeracmastr.acname  AS brokername,                                                                                                                   " +
            "                 sas.trnasid,                                                                                                                                           " +
            "                 sas.voucherno,                                                                                                                                         " +
            "                 CASE                                                                                                                                                   " +
            "                                 WHEN ifnull(sas.bill,'') = '' THEN ifnull(sas.chequeno,'')                                                                             " +
            "                                 Else ifnull(sas.bill,'')                                                                                                               " +
            "                 End bill,                                                                                                                                              " +
            "                 sas.tallied,                                                                                                                                           " +
            "                 sas.partystatus,                                                                                                                                       " +
            "                 sas.refactrnasid,                                                                                                                                      " +
            "                 sas.dramount,                                                                                                                                          " +
            "                 sas.cramount,                                                                                                                                          " +
            "                 sas.menutype,                                                                                                                                          " +
            "                 sas.acdate,                                                                                                                                            " +
            "                 sas.paydays,                                                                                                                                           " +
            "                 sas.chequeno,                                                                                                                                          " +
            "                 sas.chequedate,                                                                                                                                        " +
            "                 sas.rectype,                                                                                                                                           " +
            "                 sas.totalpcs,                                                                                                                                          " +
            "                 sas.totalqty,                                                                                                                                          " +
            "                 sas.lessqty,                                                                                                                                           " +
            "                 sas.remarks,                                                                                                                                           " +
            "                 sas.slips,                                                                                                                                             " +
            "                 sas.postingdate,                                                                                                                                       " +
            "                 ifnull(cast(sas.clearingdate As Char),'') clearingdate,                                                                                                " +
            "                 sas.eptid,                                                                                                                                             " +
            "                 sas.acyear,                                                                                                                                            " +
            "                 sas.actrnasid,                                                                                                                                         " +
            "                 cast(concat('+ CDate(" + frmdt + ").ToString(dd-MM-yyyy)+ ', ' to ','+ CDate(" + todt + ").ToString(dd-MM-yyyy)+ ') AS char)    periodof,     " +
            "                 cast(concat('+ CDate(" + frmdt + ").ToString(yyyy) + 1+ ', '-','+ CDate(" + todt + ").ToString(yyyy) + 1+ ') AS        char)    asseyear,     " +
            "                 b.coname                                                                                                                              As company,      " +
            "                 b.destination                                                                                                                            signatures,   " +
            "                 b.coperson                                                                                                                               person,       " +
            "                 ''                                                                                                                                       remarks,      " +
            " ifnull(sas.`remarks`,'')                                                                                                                 narration,                    " +
            "                 CASE                                                                                                                                                   " +
            "                                 WHEN sas.dramount > 0 THEN 1 " +
            "                                 Else 0 " +
            "                 End code " +
            " FROM            sas " +
            " LEFT JOIN       accountmaster " +
            " On              ( " +
            "                                 sas.refactrnasid = accountmaster.trnasid) " +
            " LEFT JOIN       companymaster " +
            " On              ( " +
            "                                 sas.companyid = companymaster.trnasid) " +
            " LEFT OUTER JOIN accountmaster groupacmatr " +
            " On              ( " +
            "                                 sas.refgcode = groupacmatr.trnasid) " +
            " LEFT OUTER JOIN accountmaster a " +
            " On              ( " +
            "                                 a.trnasid = sas.actrnasid) " +
            " LEFT OUTER JOIN accountmaster brokeracmastr " +
            " On              ( " +
            "                                 sas.bcd = brokeracmastr.trnasid) " +
            " LEFT JOIN       companymaster b " +
            " On              ( " +
            "                                 1 = b.trnasid) " +
            " WHERE           sas.billid <> -100 " +
            " And             sas.acdate BETWEEN '" + frmdt + "' And '" + todt + "' " +
            " AND a.trnasid = " + accid +
            " AND companymaster.trnasid = " + comid +
            strfilter + " ORDER BY   15, 37, 28, 21    " // 5, 26, 18, 22, 14; ";
        //console.log(sql)
        //const sql = "select * from sas";  
        db.query(sql, (err, data) => {
            if (err) return res.json(err);
            return res.json(data);
        })
    } catch (e) {
        console.log(e)
    }
})
app.post('/AccountMaster', (req, res) => {
    // console.log(req.body)
    // console.log(req.body.ipaddress)
    // console.log(req.body.port)
    const db = mysql.createConnection({
        host: req.body.ipaddress,
        user: "root",
        password: '704@LinoWelcome',
        port: req.body.port,
        database: req.body.database
    })
    try {
        const sql = "SELECT * FROM accountmaster where AcName <> ' ' and " +
            " ( trnasid in (select AcTrnasID from billmaster) or " +
            "   trnasid in (select AcTrnasID from sas) or " +
            "   trnasid in (select AcTrnasID from sas_agency) ) " +
            " ORDER BY AcName;";
        db.query(sql, (err, data) => {
            if (err) return res.json(err);
            //console.log(res.json(data))
            return res.json(data);
        })
    } catch (e) {
        console.log(e)
    }
})
app.post('/CompanyMaster', (req, res) => {
    // console.log(req.body)
    // console.log(req.body.ipaddress)
    // console.log(req.body.port)
    const db = mysql.createConnection({
        host: req.body.ipaddress,
        user: "root",
        password: '704@LinoWelcome',
        port: req.body.port,
        database: req.body.database
    })
    //and mobile_visible = 1
    // const sql_exist = "SELECT * FROM INFORMATION_SCHEMA.COLUMNS " + 
    // " WHERE TABLE_NAME='companymaster' AND column_name='mobile_visible'";
    // db.query(sql_exist, (err, data) => {
    //     if (err) return res.json(err);
    //     return res.json(data);
    // })

    try {
        const sql = "SELECT * FROM companymaster where CoName <> ' ' and visible = 1 ORDER BY CoName;";
        db.query(sql, (err, data) => {
            if (err) return res.json(err);
            return res.json(data);
        })
    } catch (e) {
        console.log(e)
    }
})

app.post('/PartyOutstanding', (req, res) => {
    // console.log(req.body)
    // console.log(req.body.ipaddress)
    // console.log(req.body.port)

    const frmdt = req.body.fromdate
    const todt = req.body.todate
    const accid = req.body.accid
    const comid = req.body.comid
    const pend = (req.body.pending == false ? 0 : 1)
    const db = mysql.createConnection({
        host: req.body.ipaddress,
        user: "root",
        password: '704@LinoWelcome',
        port: req.body.port,
        database: req.body.database
    })
    try {
        const strfilter = (pend == 1 ? " AND (((ifnull(`a`.`NetAmount`,0) + ifnull(`a`.`TOT_AL`,0)) - ifnull(`a`.`RecPayAmount`,0)) - `a`.`RG_PAID`) <> 0  " : "")

        const sql = "Select " +
            "    round(`a`.`RG_PAID`, 0) As `GR`, " +
            "    `g`.`CoName` AS `@CO_COMPANY`/*`g`.`CoName`;CO*/ , " +
            "    `g`.`trnasid` AS `CO_CODE`/*`g`.`trnasid`*/, " +
            "    `g`.`CoShtName` AS `CoShtName` /*`g`.`CoShtName`*/, " +
            "    `f`.`MenuDesc` AS `@MN_Menu`/*`f`.`MenuDesc`;MN*/, " +
            "    `f`.`TrnasID` AS `MN_code`/*`f`.`TrnasID`*/, " +
            "    `a`.`TrnasID` AS `BILLID`/*`a`.`TrnasID`*/, " +
            "    `a`.`Bill` AS `BILL`/*`a`.`Bill`*/, " +
            "    Monthname(`a`.`BillDate`) As `Months`/*Monthname(`a`.`BillDate`)*/, " +
            "    `a`.`BillDate` AS `BILLSDATE`/*`a`.`BillDate`*/, " +
            "    `a`.`BillDate` AS `BILLDATE`/*`a`.`BillDate`*/, " +
            "    `a`.`Remarks` AS `REMARKS`/*`a`.`Remarks`*/, " +
            "    `a`.`Challn` AS `CHALLAN`/*`a`.`Challn`*/, " +
            "    `a`.`SlipVoucher` AS `SLIPVOUCHER`/*`a`.`SlipVoucher`*/, " +
            "    `z`.`AcName` AS `@GR_NAME`/*`z`.`AcName`;GR*/, " +
            "    `z`.`TrnasId` AS `GR_Code`/*`z`.`TrnasId`*/, " +
            "    `d`.`AcName` AS `AC_NAME_1`/*`d`.`AcName`;AC*/, " +
            "    concat(`d`.`AcName`,'(',d.cityname,' ','Ph.',ifnull(d.`acphone`,''),' ',ifnull(d.`mobile`,'')) AS `@AC_NAME` /*concat(`d`.`AcName`,_latin1' (',ifnull(`d`.`AcFlatNo`,''),ifnull(`d`.`AcStreetRd`,''),ifnull(`d`.`AcOthers`,''),ifnull(`d`.`CityName`,''),' Ph.',ifnull(d.AcPhone,''),' Mb.',ifnull(d.`mobile`,''),_latin1') ');AC*/, " +
            "    concat(`d`.`AcName`,' ',d.cityname,' ',' Person:',ifnull(d.`AcPerson`,''),' ','Ph.',ifnull(d.`acphone`,''),' ',ifnull(d.`mobile`,'')) AS `ACNAMECITYPERSON` /*concat(concat(`d`.`AcName`,'(',d.cityname,' ',' Person:',ifnull(d.`AcPerson`,''),' ','Ph.',ifnull(d.`acphone`,''),' ',ifnull(d.`mobile`,'')'))*/, " +
            "    ifnull(concat(`d`.`AcName`,' ',ifnull(`d`.`AcFlatNo`,''),ifnull(`d`.`AcStreetRd`,''),ifnull(`d`.`AcOthers`,''), ' ', ifnull(`d`.`CityName`,''),' Person:',ifnull(d.`AcPerson`,''),' Ph.',ifnull(d.AcPhone,''),' Mb.',ifnull(d.`mobile`,''),_latin1') '),'') AS `CUSTOMER`/*ifnull(concat(`d`.`AcName`,' ',ifnull(`d`.`AcFlatNo`,''),ifnull(`d`.`AcStreetRd`,''),ifnull(`d`.`AcOthers`,''), ' ', ifnull(`d`.`CityName`,''),' Person:',ifnull(d.`AcPerson`,''),' Ph.',ifnull(d.AcPhone,''),' Mb.',ifnull(d.`mobile`,''),_latin1') '),'')*/, " +
            "    `d`.`TrnasID` AS `AC_code`/*`d`.`TrnasID`*/, " +
            "    ifnull(concat(`e`.`AcName`,' ',ifnull(`e`.`AcFlatNo`,''),ifnull(`e`.`AcStreetRd`,''),ifnull(`e`.`AcOthers`,''), ' ', ifnull(`e`.`CityName`,''),' Person:',ifnull(e.`AcPerson`,''),' Ph.',ifnull(e.AcPhone,''),' Mb.',ifnull(e.`mobile`,''),_latin1') '),'') AS `BROKERPERSON`/*ifnull(concat(`e`.`AcName`,_latin1' (',ifnull(`e`.`AcFlatNo`,''),ifnull(`e`.`AcStreetRd`,''),ifnull(`e`.`AcOthers`,''), ' ', ifnull(`e`.`CityName`,''),' Person:',ifnull(d.`AcPerson`,''),' Ph.',ifnull(e.AcPhone,''),' Mb.',ifnull(e.`mobile`,''),_latin1') '),'')*/, " +
            "    ifnull(concat(`e`.`AcName`,' ',ifnull(`e`.`AcFlatNo`,''),ifnull(`e`.`AcStreetRd`,''),ifnull(`e`.`AcOthers`,''), ' ', ifnull(`e`.`CityName`,''),' Ph.',ifnull(e.AcPhone,''),' Mb.',ifnull(e.`mobile`,''),_latin1') '),'Missing') AS `@BR_BROKER`/*`e`.`AcName`;BR*/, " +
            "    ifnull(concat(`e`.`AcName`),'') AS `BROKER`/*ifnull(concat(`e`.`AcName`),'')*/, " +
            "    `e`.`TrnasID` AS `BR_Code`/*`e`.`TrnasID`*/, " +
            "    `a`.`NetAmount` AS `NETAMT`/*`a`.`ActualNetAmount`*/, " +
            "    `i`.`AcName` AS `@AG_REFNAME`/*`i`.`AcName`;AG*/, " +
            "    `i`.`TrnasID` AS `AG_CODE`/*`i`.`TrnasID`*/, " +
            "    `h`.`CityName` AS `@CT_City`/*`h`.`CityName`;CT*/, " +
            "    `h`.`TrnasID` AS `CT_code`/*`h`.`TrnasID`*/, " +
            "    `j`.`StName` AS `@ST_State`/*`j`.`StName`;ST*/, " +
            "    `j`.`TrnasID` AS `ST_Code`/*`j`.`TrnasID`*/, " +
            "    `l`.`AcName` AS `@GR_GroupName`/*`l`.`AcName`;AC*/, " +
            "    `l`.`TrnasID` AS `GR_code`/*`l`.`TrnasID`*/, " +
            "    (`a`.`RG_AMT` - `a`.`RG_PAID`) AS `RG BALANCE`/*(`a`.`RG_AMT` - `a`.`RG_PAID`)*/, " +
            "    `a`.`RG_PAID` AS `RG PAID`/*`a`.`RG_PAID`*/, " +
            "    `a`.`RG_AMT` AS `RG`/*`a`.`RG_AMT`*/, " +
            "    case when `a`.`Upd` = 0 then 1 else 0 end  as pendig /*case when `a`.`Upd` = 0 then 1 else 0 end */, " +
            "    ifnull(sum(`b`.`CrAmount`),0) AS `RecAmount` /*ifnull(sum(`b`.`CrAmount`),0)*/, " +
            "    ifnull(`a`.`RecPayAmount`,0) AS `RECPAYAMOUNT`/*ifnull(`a`.`RecPayAmount`,0)*/, " +
            "    ifnull(`c`.`VoucherNo`,0) AS `R_vo`/*ifnull(`c`.`VoucherNo`,0)*/, " +
            "    cast(ifnull(date_format(`c`.`TransDate`,_latin1'%d-%m-%Y'),_latin1'') as char charset latin1) AS `recDate` /*cast(ifnull(date_format(`c`.`TransDate`,_latin1'%d-%m-%Y'),_latin1'') as char charset latin1)*/, " +
            "    abs(ifnull(`a`.`TOT_AL`,0)) AS `discount` /*abs(ifnull(`a`.`TOT_AL`,0))*/, " +
            "    (((ifnull(`a`.`NetAmount`,0) + ifnull(`a`.`TOT_AL`,0)) - ifnull(`a`.`RecPayAmount`,0)) - `a`.`RG_PAID`) AS `BALANCE` /*(((ifnull(`a`.`NetAmount`,0) + ifnull(`a`.`TOT_AL`,0)) - ifnull(`a`.`RecPayAmount`,0)) - `a`.`RG_PAID`)*/, " +
            "   (to_days(curdate()) - to_days(`a`.`BillDate`)) AS `Days`/*cast((to_days(curdate()) - to_days(`a`.`BillDate`)) as char charset latin1)*/ " +
            "  from " +
            "    (((((((((((`billmaster` `a` left join `accountmaster` `d` on((`d`.`TrnasID` = `a`.`AcTrnasID`))) left join `accountmaster` `e` on((`e`.`TrnasID` = `a`.`BrokerCode`))) left join `recdtrn_trans` `w` on(((`w`.`BillID` = `a`.`TrnasID`) and (`w`.`TypeID` = 0) and (`w`.`TypeItem` = _latin1'BILL')))) left join `recdtrn` `c` on((`c`.`TrnasID` = `w`.`SlipID`))) left join `recdtrn_trans` `b` on(((`b`.`SlipID` = `c`.`TrnasID`) and (`b`.`TypeID` = -(1)) and (`b`.`BillID` = `a`.`TrnasID`)))) left join `menumaster` `f` on((`f`.`MenuType` = `a`.`MenuType`))) left join `companymaster` `g` on((`g`.`trnasid` = `a`.`CoID`))) left join `accountmaster` `I` on((`i`.`TrnasID` = `a`.`mnuAcTransID`))) left join `citymaster` `h` on((`h`.`TrnasID` = `d`.`CityCode`))) left join `statemaster` `j` on((`j`.`TrnasID` = `d`.`AcState`))) left join `accountmaster` `l` on((`l`.`TrnasID` = `d`.`AcGrpID`))) " +
            "left join `accountmaster` `z` on((`d`.`AcGrpID` = `z`.`TrnasID`)) " +
            "left join `accountmaster` `m` on((`e`.`CityCode` = `m`.`TrnasID`))	" +
            " where  `g`.`trnasid` =  " + comid +
            " AND `d`.`TrnasID` = " + accid +
            " AND `a`.`BillDate` between '" + frmdt + "' and '" + todt + "' " +
            " AND `a`.menutype < 1000 " +  
            strfilter +
            "   group by  " +
            "    `g`.`CoName`,`g`.`trnasid`,`f`.`MenuDesc`,`f`.`TrnasID`,`a`.`TrnasID`,`a`.`Bill`,`a`.`BillDate`,`a`.`Remarks`,`a`.`Challn`,`a`.`SlipVoucher`,`d`.`AcName`,`d`.`TrnasID`,`e`.`AcName`,`a`.`ActualNetAmount`,`a`.`RecPayAmount`,(`a`.`ActualNetAmount` - `a`.`RecPayAmount`)  " +
            " 	order by  " +
            "    `a`.`BillDate`,`a`.`billno`;";
        db.query(sql, (err, data) => {
            if (err) return res.json(err);
            return res.json(data);
        })
    } catch (e) {
        console.log(e)
    }
})

app.post('/Sales_LR_Pending', (req, res) => {
    // console.log(req.body)
    // console.log(req.body.ipaddress)
    // console.log(req.body.port)

    const frmdt = req.body.fromdate
    const todt = req.body.todate
    const accid = req.body.accid
    const comid = req.body.comid
    const pend = (req.body.pending == false ? 0 : 1)
    const db = mysql.createConnection({
        host: req.body.ipaddress,
        user: "root",
        password: '704@LinoWelcome',
        port: req.body.port,
        database: req.body.database
    })
    try {
        // const strfilter = (pend == 1 ? " AND (((ifnull(`a`.`NetAmount`,0) + ifnull(`a`.`TOT_AL`,0)) - ifnull(`a`.`RecPayAmount`,0)) - `a`.`RG_PAID`) <> 0  " : "")

        const sql = "Select `a`.`LRNumber`, a.`LRDate`, " +
            "    n.`TrnsName`, " +
            "    round(`a`.`RG_PAID`, 0) As `GR`, " +
            "    `g`.`CoName` AS `@CO_COMPANY`/*`g`.`CoName`;CO*/ , " +
            "    `g`.`trnasid` AS `CO_CODE`/*`g`.`trnasid`*/, " +
            "    `g`.`CoShtName` AS `CoShtName` /*`g`.`CoShtName`*/, " +
            "    `f`.`MenuDesc` AS `@MN_Menu`/*`f`.`MenuDesc`;MN*/, " +
            "    `f`.`TrnasID` AS `MN_code`/*`f`.`TrnasID`*/, " +
            "    `a`.`TrnasID` AS `BILLID`/*`a`.`TrnasID`*/, " +
            "    `a`.`Bill` AS `BILL`/*`a`.`Bill`*/, " +
            "    Monthname(`a`.`BillDate`) As `Months`/*Monthname(`a`.`BillDate`)*/, " +
            "    `a`.`BillDate` AS `BILLSDATE`/*`a`.`BillDate`*/, " +
            "    `a`.`BillDate` AS `BILLDATE`/*`a`.`BillDate`*/, " +
            "    `a`.`Remarks` AS `REMARKS`/*`a`.`Remarks`*/, " +
            "    `a`.`Challn` AS `CHALLAN`/*`a`.`Challn`*/, " +
            "    `a`.`SlipVoucher` AS `SLIPVOUCHER`/*`a`.`SlipVoucher`*/, " +
            "    `z`.`AcName` AS `@GR_NAME`/*`z`.`AcName`;GR*/, " +
            "    `z`.`TrnasId` AS `GR_Code`/*`z`.`TrnasId`*/, " +
            "    CONCAT(`d`.`AcName` , ' - ' , d.cityname) AS `AC_NAME_1`/*`d`.`AcName`;AC*/, " +
            "    concat(`d`.`AcName`,'(',d.cityname,' ','Ph.',ifnull(d.`acphone`,''),' ',ifnull(d.`mobile`,'')) AS `@AC_NAME` /*concat(`d`.`AcName`,_latin1' (',ifnull(`d`.`AcFlatNo`,''),ifnull(`d`.`AcStreetRd`,''),ifnull(`d`.`AcOthers`,''),ifnull(`d`.`CityName`,''),' Ph.',ifnull(d.AcPhone,''),' Mb.',ifnull(d.`mobile`,''),_latin1') ');AC*/, " +
            "    concat(`d`.`AcName`,' ',d.cityname,' ',' Person:',ifnull(d.`AcPerson`,''),' ','Ph.',ifnull(d.`acphone`,''),' ',ifnull(d.`mobile`,'')) AS `ACNAMECITYPERSON` /*concat(concat(`d`.`AcName`,'(',d.cityname,' ',' Person:',ifnull(d.`AcPerson`,''),' ','Ph.',ifnull(d.`acphone`,''),' ',ifnull(d.`mobile`,'')'))*/, " +
            "    ifnull(concat(`d`.`AcName`,' ',ifnull(`d`.`AcFlatNo`,''),ifnull(`d`.`AcStreetRd`,''),ifnull(`d`.`AcOthers`,''), ' ', ifnull(`d`.`CityName`,''),' Person:',ifnull(d.`AcPerson`,''),' Ph.',ifnull(d.AcPhone,''),' Mb.',ifnull(d.`mobile`,''),_latin1') '),'') AS `CUSTOMER`/*ifnull(concat(`d`.`AcName`,' ',ifnull(`d`.`AcFlatNo`,''),ifnull(`d`.`AcStreetRd`,''),ifnull(`d`.`AcOthers`,''), ' ', ifnull(`d`.`CityName`,''),' Person:',ifnull(d.`AcPerson`,''),' Ph.',ifnull(d.AcPhone,''),' Mb.',ifnull(d.`mobile`,''),_latin1') '),'')*/, " +
            "    `d`.`TrnasID` AS `AC_code`/*`d`.`TrnasID`*/, " +
            "    ifnull(concat(`e`.`AcName`,' ',ifnull(`e`.`AcFlatNo`,''),ifnull(`e`.`AcStreetRd`,''),ifnull(`e`.`AcOthers`,''), ' ', ifnull(`e`.`CityName`,''),' Person:',ifnull(e.`AcPerson`,''),' Ph.',ifnull(e.AcPhone,''),' Mb.',ifnull(e.`mobile`,''),_latin1') '),'') AS `BROKERPERSON`/*ifnull(concat(`e`.`AcName`,_latin1' (',ifnull(`e`.`AcFlatNo`,''),ifnull(`e`.`AcStreetRd`,''),ifnull(`e`.`AcOthers`,''), ' ', ifnull(`e`.`CityName`,''),' Person:',ifnull(d.`AcPerson`,''),' Ph.',ifnull(e.AcPhone,''),' Mb.',ifnull(e.`mobile`,''),_latin1') '),'')*/, " +
            "    ifnull(concat(`e`.`AcName`,' ',ifnull(`e`.`AcFlatNo`,''),ifnull(`e`.`AcStreetRd`,''),ifnull(`e`.`AcOthers`,''), ' ', ifnull(`e`.`CityName`,''),' Ph.',ifnull(e.AcPhone,''),' Mb.',ifnull(e.`mobile`,''),_latin1') '),'Missing') AS `@BR_BROKER`/*`e`.`AcName`;BR*/, " +
            "    ifnull(concat(`e`.`AcName`),'') AS `BROKER`/*ifnull(concat(`e`.`AcName`),'')*/, " +
            "    `e`.`TrnasID` AS `BR_Code`/*`e`.`TrnasID`*/, " +
            "    `a`.`NetAmount` AS `NETAMT`/*`a`.`ActualNetAmount`*/, " +
            "    `i`.`AcName` AS `@AG_REFNAME`/*`i`.`AcName`;AG*/, " +
            "    `i`.`TrnasID` AS `AG_CODE`/*`i`.`TrnasID`*/, " +
            "    `h`.`CityName` AS `@CT_City`/*`h`.`CityName`;CT*/, " +
            "    `h`.`TrnasID` AS `CT_code`/*`h`.`TrnasID`*/, " +
            "    `j`.`StName` AS `@ST_State`/*`j`.`StName`;ST*/, " +
            "    `j`.`TrnasID` AS `ST_Code`/*`j`.`TrnasID`*/, " +
            "    `l`.`AcName` AS `@GR_GroupName`/*`l`.`AcName`;AC*/, " +
            "    `l`.`TrnasID` AS `GR_code`/*`l`.`TrnasID`*/, " +
            "    (`a`.`RG_AMT` - `a`.`RG_PAID`) AS `RG BALANCE`/*(`a`.`RG_AMT` - `a`.`RG_PAID`)*/, " +
            "    `a`.`RG_PAID` AS `RG PAID`/*`a`.`RG_PAID`*/, " +
            "    `a`.`RG_AMT` AS `RG`/*`a`.`RG_AMT`*/, " +
            "    case when `a`.`Upd` = 0 then 1 else 0 end  as pendig /*case when `a`.`Upd` = 0 then 1 else 0 end */, " +
            "    ifnull(sum(`b`.`CrAmount`),0) AS `RecAmount` /*ifnull(sum(`b`.`CrAmount`),0)*/, " +
            "    ifnull(`a`.`RecPayAmount`,0) AS `RECPAYAMOUNT`/*ifnull(`a`.`RecPayAmount`,0)*/, " +
            "    ifnull(`c`.`VoucherNo`,0) AS `R_vo`/*ifnull(`c`.`VoucherNo`,0)*/, " +
            "    cast(ifnull(date_format(`c`.`TransDate`,_latin1'%d-%m-%Y'),_latin1'') as char charset latin1) AS `recDate` /*cast(ifnull(date_format(`c`.`TransDate`,_latin1'%d-%m-%Y'),_latin1'') as char charset latin1)*/, " +
            "    abs(ifnull(`a`.`TOT_AL`,0)) AS `discount` /*abs(ifnull(`a`.`TOT_AL`,0))*/, " +
            "    (((ifnull(`a`.`NetAmount`,0) + ifnull(`a`.`TOT_AL`,0)) - ifnull(`a`.`RecPayAmount`,0)) - `a`.`RG_PAID`) AS `BALANCE` /*(((ifnull(`a`.`NetAmount`,0) + ifnull(`a`.`TOT_AL`,0)) - ifnull(`a`.`RecPayAmount`,0)) - `a`.`RG_PAID`)*/, " +
            "   (to_days(curdate()) - to_days(`a`.`BillDate`)) AS `Days`/*cast((to_days(curdate()) - to_days(`a`.`BillDate`)) as char charset latin1)*/ " +
            "  from " +
            "    (((((((((((`billmaster` `a` left join `accountmaster` `d` on((`d`.`TrnasID` = `a`.`AcTrnasID`))) left join `accountmaster` `e` on((`e`.`TrnasID` = `a`.`BrokerCode`))) left join `recdtrn_trans` `w` on(((`w`.`BillID` = `a`.`TrnasID`) and (`w`.`TypeID` = 0) and (`w`.`TypeItem` = _latin1'BILL')))) left join `recdtrn` `c` on((`c`.`TrnasID` = `w`.`SlipID`))) left join `recdtrn_trans` `b` on(((`b`.`SlipID` = `c`.`TrnasID`) and (`b`.`TypeID` = -(1)) and (`b`.`BillID` = `a`.`TrnasID`)))) left join `menumaster` `f` on((`f`.`MenuType` = `a`.`MenuType`))) left join `companymaster` `g` on((`g`.`trnasid` = `a`.`CoID`))) left join `accountmaster` `I` on((`i`.`TrnasID` = `a`.`mnuAcTransID`))) left join `citymaster` `h` on((`h`.`TrnasID` = `d`.`CityCode`))) left join `statemaster` `j` on((`j`.`TrnasID` = `d`.`AcState`))) left join `accountmaster` `l` on((`l`.`TrnasID` = `d`.`AcGrpID`))) " +
            "left join `accountmaster` `z` on((`d`.`AcGrpID` = `z`.`TrnasID`)) " +
            "left join `accountmaster` `m` on((`e`.`CityCode` = `m`.`TrnasID`))	" +
            "left join `transportermaster` `n` on((`a`.`TranportrCode` = `n`.`TrnasID`)) " + 
            " where  `g`.`trnasid` =  " + comid +
            " AND `i`.`TrnasID` = " + accid +
            " AND `a`.`BillDate` between '" + frmdt + "' and '" + todt + "' " +
            " AND `a`.menutype < 1000 " +  
            " AND IFNULL(`a`.`LRNumber`,'') = '' " + 
            "   group by  " +
            "    `g`.`CoName`,`g`.`trnasid`,`f`.`MenuDesc`,`f`.`TrnasID`,`a`.`TrnasID`,`a`.`Bill`,`a`.`BillDate`,`a`.`Remarks`,`a`.`Challn`,`a`.`SlipVoucher`,`d`.`AcName`,`d`.`TrnasID`,`e`.`AcName`,`a`.`ActualNetAmount`,`a`.`RecPayAmount`,(`a`.`ActualNetAmount` - `a`.`RecPayAmount`)  " +
            " 	order by  " +
            "    `a`.`BillDate`,`a`.`billno`;";
        db.query(sql, (err, data) => {
            if (err) return res.json(err);
            return res.json(data);
        })
    } catch (e) {
        console.log(e)
    }
})


app.post('/MillOutstanding', (req, res) => {
    // console.log(req.body)
    // console.log(req.body.ipaddress)
    // console.log(req.body.port)
    const frmdt = req.body.fromdate
    const todt = req.body.todate
    const accid = req.body.accid
    const comid = req.body.comid
    const pend = (req.body.pending == false ? 0 : 1)
    const db = mysql.createConnection({
        host: req.body.ipaddress,
        user: "root",
        password: '704@LinoWelcome',
        port: req.body.port,
        database: req.body.database
    })
    try {
        const strfilter = (pend == 1 ? " AND `btrans`.`QTY` - IFNULL(INW.INW_QTY, 0) - IFNULL(INW.INW_SHRT, 0) <> 0  " : "")

        const sql = " Select " +
            "     `btrans`.`QTY` - IFNULL(INW.INW_QTY, 0) - IFNULL(INW.INW_SHRT, 0) Balance, " +
            "     `btrans`.`QTY`, " +
            "      IFNULL(INW.INW_QTY, 0) INW_QTY, " +
            "      IFNULL(INW.INW_SHRT, 0) INW_SHRT, " +
            "     `companymaster`.`CoName` AS `@CO_COMPANY` /*`companymaster`.`CoName`;CO*/, " +
            "     `companymaster`.`TrnasID` AS `CO_CODE` /*`companymaster`.`TrnasID`*/, " +
            "     `menumaster`.`ParantMenu` AS `PARENTMENU` /*`menumaster`.`ParantMenu`*/, " +
            "     `menumaster`.`MenuDesc` AS `@MN_MENU`/*`menumaster`.`MenuDesc`;MN*/, " +
            "     `menumaster`.`TrnasID` AS `MN_CODE`/*`menumaster`.`TrnasID`*/, " +
            "     `billmaster`.`VoucherNo` AS `VOUCHER_NO`/*`billmaster`.`VoucherNo`*/, " +
            "     `billmaster`.`Challn` AS `Challan`/*`billmaster`.`Challn`*/, " +
            "     `billmaster`.`Bill` AS `BILLS`/*`billmaster`.`Bill`*/, " +
            "     MonthName(`billmaster`.`BillDate`) As `Months`/*MothName(`billmaster`.`BillDate`)*/, " +
            "     `billmaster`.`BillDate` AS `BILLSDATE`/*`billmaster`.`BillDate`*/, " +
            "     `billmaster`.`BillDate` AS `BILLDATE`/*`billmaster`.`BillDate`*/, " +
            "     `refacc`.`AcName` AS `@AC_NAME` /*`refacc`.`AcName`;AC*/, " +
            "     `refacc`.`TrnasID` AS `AC_CODE` /*`refacc`.`TrnasID`*/, " +
            "     `b`.`AcName` AS `@GR_NAME` /*`b`.`AcName`;GR*/, " +
            "     `b`.`TrnasID` AS `GR_CODE` /*`b`.`TrnasID`*/, " +
            "     `accountmaster`.`AcName` AS `@AG_REFNAME` /*`accountmaster`.`AcName`;AG*/, " +
            "     `accountmaster`.`TrnasID` AS `AG_CODE` /*`accountmaster`.`TrnasID`*/, " +
            "     `accountmaster`.`AcFlatNo` AS `ADDRESS_1` /*`accountmaster`.`AcFlatNo`*/, " +
            "     `accountmaster`.`AcStreetRd` AS `ADDRESS_2`/*`accountmaster`.`AcStreetRd`*/, " +
            "     `accountmaster`.`AcOthers` AS `ADDRESS_3` /*`accountmaster`.`AcOthers`*/, " +
            "     `statemaster`.`StName` AS `@ST_STATE` /*`statemaster`.`StName`;ST*/, " +
            "     `statemaster`.`TrnasID` AS `ST_CODE` /*`statemaster`.`TrnasID`*/, " +
            "     `Citymaster`.`CityName` AS `@CT_City` /*`Citymaster`.`CityName`;CT*/, " +
            "     `Citymaster`.`TrnasID` AS `CT_CODE` /*`Citymaster`.`TrnasID`*/, " +
            "     `accountmaster`.`AcPIN` AS `PIN` /*`accountmaster`.`AcPIN` */, " +
            "     `billmaster`.`NetAmount` AS `DR_AMT` /*`billmaster`.`NetAmount`*/, " +
            "     `billmaster`.`PayDays` AS `PA_DAYS` /*`billmaster`.`PayDays`*/, " +
            "     `billmaster`.`Remarks` AS `Narration` /*`billmaster`.`Remarks`*/, " +
            "     `itemmaster`.`ITEMNAME` AS `@IT_ITEMNAME` /*`itemmaster`.`ITEMNAME`;IT*/, " +
            "     `itemmaster`.`TRNASID` AS `it_code` /*`itemmaster`.`TRNASID`*/, " +
            "     `btrans`.`AMOUNT` AS `AMOUNT` /*`btrans`.`AMOUNT`*/, " +
            "     `btrans`.`BATCHNO` AS `BATCHNO` /*`btrans`.`BATCHNO`*/, " +
            "     `btrans`.`CHKKG` AS `CHKKG` /*`btrans`.`CHKKG`*/, " +
            "     `btrans`.`CHKMTRS` AS `CHKMTRS` /*`btrans`.`CHKMTRS`*/, " +
            "     `btrans`.`colorcode` AS `COLORCODE` /*`btrans`.`colorcode`*/, " +
            "     `btrans`.`CONPCS` AS `CONPCS` /*`btrans`.`CONPCS`*/, " +
            "     `btrans`.`CONQTY` AS `CONQTY` /*`btrans`.`CONQTY`*/, " +
            "     `btrans`.`CPCS` AS `CPCS` /*`btrans`.`CPCS`*/, " +
            "     `btrans`.`CQTY` AS `CQTY` /*`btrans`.`CQTY`*/, " +
            "     `btrans`.`CUT` AS `cut` /*`btrans`.`CUT`*/, " +
            "     `btrans`.`PCS` AS `PCS` /*`btrans`.`PCS`*/, " +
            "     `btrans`.`QTY` AS `qty`/*`btrans`.`QTY`*/, " +
            "     `btrans`.`RATE` AS `rate` /*`btrans`.`RATE`*/, " +
            "     `btrans`.`REMARK` AS `ItemRemarks` /*`btrans`.`REMARK`*/, " +
            "     `designmaster`.`DESIGN` AS `DESIGN`/*`designmaster`.`DESIGN`;DG*/, " +
            "     `btrans`.`DISAMT` AS `DISAMT` /*`btrans`.`DISAMT`*/, " +
            "     `btrans`.`DQTY` AS `DQTY` /*`btrans`.`DQTY`*/, " +
            "     `btrans`.`GQTY` AS `GQTY` /*`btrans`.`GQTY`*/, " +
            "     `btrans`.`GROSSAMT` AS `GROSSAMT` /*`btrans`.`GROSSAMT`*/, " +
            "     `btrans`.`HSNCODE` AS `HSNCODE` /*`btrans`.`HSNCODE`*/, " +
            "     `btrans`.`ITEM_SCREEN_NAME` AS `ITEM_SCREEN_NAME` /*`btrans`.`ITEM_SCREEN_NAME`*/, " +
            "     `btrans`.`JFRESH` AS `JFRESH` /*`btrans`.`JFRESH`*/, " +
            "     `btrans`.`JPLAIN` AS `JPLAIN` /*`btrans`.`JPLAIN`*/, " +
            "     `btrans`.`JCL` AS `JCL`/*`btrans`.`JCL`*/, " +
            "     `btrans`.`JRANGE` AS `JRANGE`/*`btrans`.`JRANGE`*/, " +
            "     `btrans`.`JRF` AS `JRF` /*`btrans`.`JRF`*/, " +
            "     `btrans`.`JRREMARK` AS `JRREMARK` /*`btrans`.`JRREMARK`*/, " +
            "     `btrans`.`JSECOND` AS `JSECOND` /*`btrans`.`JSECOND`*/, " +
            "     `btrans`.`JTYPE` AS `JTYPE` /*`btrans`.`JTYPE`*/, " +
            "     `btrans`.`JWORK` AS `JWORK`/*`btrans`.`JWORK`*/, " +
            "     `btrans`.`KGDIFF` AS `KGDIFF` /*`btrans`.`KGDIFF`*/, " +
            "     `btrans`.`LOTNO` AS `LOTNO` /*`btrans`.`LOTNO`*/, " +
            "     `btrans`.`MACHINENO` AS `MACHINENO` /*`btrans`.`MACHINENO`*/, " +
            "     `btrans`.`MILLCHNO` AS `MILLCHNO` /*`btrans`.`MILLCHNO`*/, " +
            "     `btrans`.`MTRSDIFF` AS `MTRSDIFF` /*`btrans`.`MTRSDIFF`*/, " +
            "     `btrans`.`OK` AS `OK` /*`btrans`.`OK`*/, " +
            "     `btrans`.`PACK` AS `PACK` /*`btrans`.`PACK`*/, " +
            "     `btrans`.`PPCS` AS `PPCS`, " +
            "     `btrans`.`RATEINCVAT` AS `RATEINCVAT` /*`btrans`.`RATEINCVAT`*/, " +
            "     `btrans`.`SHRT_PER` AS `SHRT_PER` /*`btrans`.`SHRT_PER`*/, " +
            "     `btrans`.`SHORT` AS `SHORT`/*`btrans`.`SHORT`*/, " +
            "     `btrans`.`SPCS` AS `SPCS` /*`btrans`.`SPCS`*/, " +
            "     `btrans`.`VATPERCENTAGE` AS `VATPERCENTAGE` /*`btrans`.`VATPERCENTAGE`*/, " +
            "     `btrans`.`VATAMT` AS `VATAMT` /*`btrans`.`VATAMT`*/, " +
            "     `btrans`.`WEIGHT` AS `WEIGHT` /*`btrans`.`WEIGHT`*/, " +
            "     `btrans`.`WASTE` AS `WASTE` /*`btrans`.`WASTE`*/, " +
            "     `btrans`.`party` AS `party` /*`btrans`.`party`*/, " +
            " `a`.`VoucherNo` AS `Bill_Vour` /*`a`.`VoucherNo`*/, " +
            " case when  ifnull(billmaster.`Upd`,'') = 'Y' then 0 else 1 end pend /*case when  ifnull(billmaster.`Upd`,'') = 'Y' then 0 else 1 end*/, " +
            "     (case when (ifnull(`btrans`.`LOTNO`,_latin1'') = _latin1'') then 1 else 0 end) AS `Pend1` /*(case when (ifnull(`btrans`.`LOTNO`,_latin1'') = _latin1'') then 1 else 0 end)*/ " +
            "   from " +
            "     ((((((((`billmaster` left join `btrans` on((`billmaster`.`TrnasID` = `btrans`.`BILLTRANSID`))) left join `accountmaster` on((`billmaster`.`AcTrnasID` = `accountmaster`.`TrnasID`))) left join `accountmaster` `refacc` on((`billmaster`.`mnuAcTransID` = `refacc`.`TrnasID`))) left join `menumaster` on((`billmaster`.`MenuType` = `menumaster`.`MenuType`))) left join `companymaster` on((`billmaster`.`CoID` = `companymaster`.`TrnasID`))) left join `itemmaster` on((`btrans`.`ITEMCODE` = `itemmaster`.`TRNASID`))) left join `designmaster` on((`designmaster`.`TRNASID` = `btrans`.`DESIGN_ID`))) left join `statemaster` on((`accountmaster`.`AcState` = `statemaster`.`TrnasID`))) " +
            " left join `billmaster` a on((a.`TrnasID` = `btrans`.`pur_bill_id`)) " +
            " left join `Citymaster` on((`accountmaster`.`CityCode` = `Citymaster`.`TrnasID`)) " +
            " left join `accountmaster` b on((`accountmaster`.`AcGrpID` = `b`.`TrnasID`)) " +
            "  LEFT JOIN ( " +
            "    SELECT " +
            "         btrans.`OUT_BILL_ID` AS OUT_ID, " +
            "         SUM(btrans.PCS) AS INW_PCS, " +
            "         SUM(btrans.QTY) AS INW_QTY, " +
            "         SUM(btrans.`SHORT`) AS INW_SHRT, " +
            "         SUM(btrans.`CONPCS`) AS INW_CONPCS, " +
            "         SUM(btrans.`CONQTY`) AS INW_CONQTY " +
            "         FROM btrans " +
            "         left join BILLMASTER on (BILLMASTER.TrnasID=btrans.`BILLTRANSID`) " +
            "         GROUP BY btrans.`OUT_BILL_ID`) INW ON (INW.OUT_ID=billmaster.`TrnasID`) " +
            " where " +
            "     (`menumaster`.`ParantMenu` = 'Mill Outward') 	 " +
            " AND  `billmaster`.`CoID` =  " + comid +
            " AND `billmaster`.`AcTrnasID` = " + accid +
            " AND `billmaster`.`BillDate` between '" + frmdt + "' and '" + todt + "' " +
            strfilter +
            " order by " +
            "    billmaster.billno, month(billmaster.`BILLDATE`),monthname(billmaster.`BILLDATE`),billmaster.`BILLDATE`;	 "
        db.query(sql, (err, data) => {
            if (err) return res.json(err);
            return res.json(data);
        })
    } catch (e) {
        console.log(e)
    }
})

app.post('/database', (req, res) => {
    const db = mysql.createConnection({
        host: req.body.ipaddress,
        user: "root",
        password: '704@LinoWelcome',
        port: req.body.port,
        database: "defaultsas"
    })
    try {
        const sql = "SELECT COAYEAR, DATABASENME FROM `existedcompanyinfo` " +
            " GROUP BY COAYEAR, DATABASENME " +
            " ORDER BY COAYEAR DESC"
        db.query(sql, (err, data) => {
            if (err) return res.json(err);
            return res.json(data);
        })
    } catch (e) {
        console.log(e)
    }
})

app.post('/menus', (req, res) => {
    const db = mysql.createConnection({
        host: req.body.ipaddress,
        user: "root",
        password: '704@LinoWelcome',
        port: req.body.port,
        database: "defaultsas"
    })
    try {
        const sql = "SELECT COAYEAR, DATABASENME FROM `existedcompanyinfo` " +
            " GROUP BY COAYEAR, DATABASENME " +
            " ORDER BY COAYEAR DESC"
        db.query(sql, (err, data) => {
            if (err) return res.json(err);
            return res.json(data);
        })
    } catch (e) {
        console.log(e)
    }
})

app.post('/ItemMaster', (req, res) => {
    const db = mysql.createConnection({
        host: req.body.ipaddress,
        user: "root",
        password: '704@LinoWelcome',
        port: req.body.port,
        database: req.body.database
    })
    try {
        const sql = "SELECT * FROM itemmaster where itemname <> ' ' " +
            " ORDER BY itemname;";
        db.query(sql, (err, data) => {
            if (err) return res.json(err);
            //console.log(res.json(data))
            return res.json(data);
        })
    } catch (e) {
        console.log(e)
    }
})
app.post('txt', (req, res) => {
    //console.log(req)
    const fs = require('node:fs');
    //console.log(req)
    const content = req;
    fs.writeFile('/test.txt', content, err => {
        if (err) {
            console.error(err);
        } else {
            // file written successfully
        }
    });

})
app.get('/', (re, res) => {
    return res.json("From Trail")
})
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
