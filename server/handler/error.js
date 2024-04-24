//return code
exports.RespTokenErr = 4000
exports.RespUserOrPassErr = 4001
exports.RespParamErr = 4002
exports.RespUserExitErr = 4003
exports.RespUserNotExitErr = 4004
exports.RespUpdateErr = 4005
exports.RespExitFriendErr = 4006
exports.RespCreateErr = 4007
exports.RespExitGroupErr = 4008
exports.RespBingNotLogin = 4009
exports.RespBingErrorProxy = 4010
exports.RespGroupInsertError = 4011
exports.RespGroupDeletError = 4012
exports.RespServerErr = 5000

exports.RespMap = {
    4000: "Client TOKEN error",
    4001: "Wrong username or password",
    4002: "Wrong parameter",
    4003: "Username already exists",
    4004: "Username and mobile phone number do not match",
    4005: "Modification failed",
    4006: "Friend already exists",
    4007: "Creation failed",
    4008: "You have joined the group chat",
    4009: "Please log in to new bing in edge browser",
    4010: "Unable to find proxy server, please set the correct proxy server",
    4011: "All the friends you invited have joined the group chat",
    4012: "Failed to exit group chat",
    5000: "Service error",
}