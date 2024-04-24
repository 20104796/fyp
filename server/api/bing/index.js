
let { RespUserOrPassErr, RespParamErr, RespServerErr, RespUserExitErr, RespUpdateErr, RespUserNotExitErr } = require('../../handler/error');
const { Query } = require('../../db/query');
const { getConversation } = require('../../utils/newBing');
const { v4: uuidv4 } = require('uuid');
let bing_rooms = {}

//生成密钥对
async function generateConversation(req, res) {}
async function getConversationInfo(req, res) {}
async function BingConnect(ws, req) {}
module.exports = {
    generateConversation,
    getConversationInfo,
    BingConnect
};