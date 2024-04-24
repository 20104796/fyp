var express = require('express');
const router = express.Router();
const rtc = require("../../api/rtc/index")

module.exports = function () {
    router.ws('/single',rtc.SingleRTCConnect)
    router.ws('/grp',rtc.groupRTCConnect)
    return router
}