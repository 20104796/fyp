
import request from '@/utils/request'

export function groupList(params) {
    return request({
        url: '/group/list',
        method: 'get',
        params
    })
}

export function groupMemberList(params) {
    return request({
        url: '/group/membersList',
        method: 'get',
        params
    })
}

export function createGroup(data) {
    return request({
        url: '/group/create_group',
        method: 'post',
        data,
        headers: { "Content-Type": "multipart/form-data;" },
    })
}

export function groupSearch(params) {
    return request({
        url: '/group/search',
        method: 'get',
        params
    })
}

export function groupJoin(params) {
    return request({
        url: '/group/join',
        method: 'get',
        params
    })
}

export function groupInfo(params) {
    return request({
        url: '/group/info',
        method: 'get',
        params
    })
}

export function renameGroup(data) {
    return request({
        url: '/group/rename',
        method: 'post',
        data,
    })
}

export function groupInvitation(data) {
    return request({
        url: '/group/invitation',
        method: 'post',
        data,
    })
}

export function exitGroup(data) {
    return request({
        url: '/group/exitGroupChat',
        method: 'post',
        data,
    })
}

export function GetRTCUser(params) {
    return request({
        url: '/group/getRTCUser',
        method: 'get',
        params
    })
}