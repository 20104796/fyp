import request from '@/utils/request'

export function getListFrd(params) {
    return request({
        url: '/friend/list',
        method: 'get',
        params
    })
}

export function friendAdd(data) {
    return request({
        url: '/friend/friendAdd',
        method: 'post',
        data
    })
}

export function friendSearch(params) {
    return request({
        url: '/friend/search',
        method: 'get',
        params
    })
}

export function friendInfo(params) {
    return request({
        url: '/friend/info',
        method: 'get',
        params
    })
}
export function friendGroupList(params) {
    return request({
        url: '/friend/groupList',
        method: 'get',
        params
    })
}
export function postCreate(data) {
    return request({
        url: '/friend/create',
        method: 'post',
        data
    })
}
export function updateFriend(data) {
    return request({
        url: '/friend/updateFriend',
        method: 'post',
        data
    })
}