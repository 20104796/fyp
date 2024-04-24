/**
 * 服务器
 */
var express = require('express');
var expressWs = require('express-ws');
var app = express();
expressWs(app)
const path = require('path');
/**
 * 解决跨域
 */
const cors = (req, res, next) => {
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin", "*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Credentials", true);
    //跨域允许的请求方式
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8")

    if (req.method.toLowerCase() == 'options')
        res.sendStatus(200);  //让options尝试请求快速结束
    else
        next();
}
/**
 * 静态文件相关
 */
//将静态文件都设为直接下载
const staticDownload = (req, res, next) => {
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin", "*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Credentials", true);
    //跨域允许的请求方式
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("content-type", "application/octet-stream")
    if (req.method.toLowerCase() == 'options')
        res.sendStatus(200);  //让options尝试请求快速结束
    else
        next();
}
app.use("/uploads", staticDownload, express.static('uploads'));

const bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: '100mb' })); //parse application/json
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true })); //parse application/json

let indexRouter = require('./routes/auth')();
let friendRouter = require('./routes/frd')();
let groupRouter = require('./routes/grp')();
let messageRouter = require('./routes/msg')();
let rtcRouter = require('./routes/rtc')();
let bingRouter = require('./routes/bing')();

app.use('/api/comfortTalker/auth', cors, indexRouter);
app.use('/api/comfortTalker/frd', cors, friendRouter);
app.use('/api/comfortTalker/grp', cors, groupRouter);
app.use('/api/comfortTalker/msg', cors, messageRouter);
app.use('/api/comfortTalker/rtc', cors, rtcRouter);
app.use('/api/comfortTalker/bing', cors, bingRouter);

module.exports = app