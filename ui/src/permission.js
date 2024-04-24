import router from './router'
import { getToken } from '@/utils/cookie' // get token from cookie
import store from '@/store'

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
    const hasToken = getToken()
    if (hasToken) {
        if (to.path === '/login') {
            // if is logged in, redirect to the home page
            return next({ path: '/' })
        } else {
            return next()
        }
    } else {
        /* has no token*/
        if (whiteList.indexOf(to.path) !== -1) {
            // in the free login whitelist, go directly
            return next()
        } else {
            // other pages that do not have permission to access are redirected to the login page.
            next(`/login?redirect=${to.path}`)
        }
    }

})