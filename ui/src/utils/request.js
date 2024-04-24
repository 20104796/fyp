import axios from 'axios'
import store from '@/store'
import router from '../router'
import { Message } from 'element-ui'
var baseURL = `${store.getters.ipaddress}/api/comfortTalker/`
const service = axios.create({
    baseURL: baseURL,
    timeout: 50000
})

// request interceptor
service.interceptors.request.use(
    (config) => {

        if (store.getters.token) {
            config.headers['authorization'] = store.getters.token
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// response interceptor
service.interceptors.response.use(
    response => {
        if (response.data.code == 401) {
            Message({
                message: response.data.message,
                type: 'error',
                duration: 1.5 * 1000,
                onClose: function () {
                    setTimeout(() => {
                        router.push("/")
                    }, 1.5 * 1000);
                }
            })
        } else {
            return response.data
        }
    },
    error => {
        console.log(error);
    }
)

export default service