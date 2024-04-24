import request from '@/utils/request'

export function generateConversation(params) {
    return request({
        url: '/bing/generate_conversation',
        method: 'get',
        params
    })
}

export function getConversationInfo(params) {
    return request({
        url: '/bing/info',
        method: 'get',
        params
    })
}