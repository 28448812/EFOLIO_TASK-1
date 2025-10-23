import { createRouter, createWebHistory } from 'vue-router'
import { getToken } from '@/config/services/token'

export const ROUTE_SIGNIN = 'sign-in'
export const ROUTE_SIGNUP = 'sign-up'
export const ROUTE_DASHBOARD = 'notepad'
export const ROUTE_WEATHER = 'weather'
export const ROUTE_CountBookAPI = 'CountBookAPI'
export const ROUTE_GetBookCount = 'GetBookCount'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    component: () => import('@/components/layouts/default.vue'),
    routes: [
        {
            path: '/signin',
            name: ROUTE_SIGNIN,
            component: () => import('@/views/auth/sign-in.vue'),
            meta: {
                title: 'Sign In',
                requiresAuth: false
            }
        },
        {
            path: '/signup',
            name: ROUTE_SIGNUP,
            component: () => import('@/views/auth/sign-up.vue'),
            meta: {
                title: 'Sign Up',
                requiresAuth: false
            }
        },
        {
            path: '/',
            name: ROUTE_DASHBOARD,
            component: () => import('@/views/Dashboard.vue'),
            meta: {
                title: '',
                requiresAuth: true
            }
        },
        {
            path: '/weather',
            name: ROUTE_WEATHER,
            component: () => import('@/views/Weather.vue'),
            meta: {
                title: '',
                requiresAuth: true
            }
        },
        {
            path: '/CountBookAPI',
            name: ROUTE_CountBookAPI,
            component: () => import('@/views/CountBookAPI.vue'),
            meta: {
                title: '',
                requiresAuth: true
            }
        },
        {
            path: '/GetBookCount',
            name: ROUTE_GetBookCount,
            component: () => import('@/views/GetBookCount.vue'),
            meta: {
                title: '',
                requiresAuth: true
            }
        },
        {
            path: '/:pathMatch(.*)*',
            redirect: '/'
        }
    ]
})

router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth === true && !getToken()) {
        return next({ name: ROUTE_SIGNIN })
    }

    return next()
})

export default router
