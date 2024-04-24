import request from '@/utils/request'
export function getMessageList(params) {
    return request({
        url: '/message/list',
        method: 'get',
        params
    })
}