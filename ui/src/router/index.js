import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Index',
        component: () => import(/* webpackChunkName: "about" */ '@/views/Index/index')
    },
    {
        path: '/code',
        name: 'code',
        component: () => import(/* webpackChunkName: "about" */ '@/views/code/index')
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import(/* webpackChunkName: "about" */ '@/views/login')
    },
    {
        path: '/audio',
        name: 'audio',
        component: () => import(/* webpackChunkName: "about" */ '@/views/real_time/audio')
    },
    {
        path: '/video',
        name: 'video',
        component: () => import(/* webpackChunkName: "about" */ '@/views/real_time/video')
    },  {
        path: '/group_audio',
        name: 'group_audio',
        component: () => import(/* webpackChunkName: "about" */ '@/views/real_time/group_audio')
    },
    {
        path: '/group_video',
        name: 'group_video',
        component: () => import(/* webpackChunkName: "about" */ '@/views/real_time/group_video')
    }
]

const router = new VueRouter({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes
})

export default router