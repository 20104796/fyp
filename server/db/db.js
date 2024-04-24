const mysql = require('mysql');
const fs = require('fs');

/**
 * 初始化参数
 */
let host = '127.0.0.1';
let port = 3306;
let user = 'root';
let password = '*****';
let database = 'dbtables';

/**
 * 如果配置文件存在,则读取配置文件,不存在则默认
 */
if (fs.existsSync("config.json")) {
    var res = JSON.parse(fs.readFileSync(`config.json`));
    host = res.host;
    port = res.port;
    user = res.user;
    password = res.password;
    database = res.database;
}

// 2. 建立与 MySQL 数据库的连接关系
const db = mysql.createPool({
    host,
    port,
    user,
    password,
    database,
    multipleStatements: true,
    charset: 'utf8mb4'
});

db.query('select 1', (err, results) => {
    if (err) {
        console.log("Failed", err.message);
        process.exit(1);
    }
    console.log("Connected");
});

module.exports = db;
