import request from '@/utils/request'

export function loginUser(data) {
    return request({
        url: 'auth/login',
        method: 'post',
        data
    })
}

export function registerNew(data) {
    return request({
        url: 'auth/register',
        method: 'post',
        data
    })
}

export function passwordUpdate(data) {
    return request({
        url: 'auth/forget_pwd',
        method: 'post',
        data
    })
}

export function updateUser(data) {
    return request({
        url: 'auth/updateInfo',
        method: 'post',
        data,
        headers: { "Content-Type": "multipart/form-data;" },
    })
}