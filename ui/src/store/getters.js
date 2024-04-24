const getters = {
    token: state => state.user.token,
    userInfo: state => state.user.userInfo,
    ipaddress: state => state.user.ipaddress,
    proxyaddress: state => state.user.proxyaddress,
}
export default getters