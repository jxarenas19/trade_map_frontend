import store from '@/state/store'

export default [
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/pages/account/login'),
        meta: {
            beforeResolve(routeTo, routeFrom, next) {
                // If the user is already logged in
                if (store.getters['auth/loggedIn']) {
                    // Redirect to the home page instead
                    next({ name: 'home' })
                } else {
                    // Continue to the login page
                    next()
                }
            },
        },
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('../views/pages/account/register'),
        meta: {
            beforeResolve(routeTo, routeFrom, next) {
                // If the user is already logged in
                if (store.getters['auth/loggedIn']) {
                    // Redirect to the home page instead
                    next({ name: 'home' })
                } else {
                    // Continue to the login page
                    next()
                }
            },
        },
    },
    {
        path: '/forgot-password',
        name: 'Forgot-password',
        component: () => import('../views/pages/account/forgot-password'),
        meta: {
            beforeResolve(routeTo, routeFrom, next) {
                // If the user is already logged in
                if (store.getters['auth/loggedIn']) {
                    // Redirect to the home page instead
                    next({ name: 'home' })
                } else {
                    // Continue to the login page
                    next()
                }
            },
        },
    },
    {
        path: '/logout',
        name: 'logout',
        meta: {
            authRequired: true,
            beforeResolve(routeTo, routeFrom, next) {
                store.dispatch('authfack/logout')
                const authRequiredOnPreviousRoute = routeFrom.matched.some(
                    (route) => route.push('/login')
                )
                // Navigate back to previous page, or home as a fallback
                next(authRequiredOnPreviousRoute ? { name: 'home' } : { ...routeFrom })
            },
        },
    },
    {
        path: '/',
        name: 'home',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/dashboard/index')
    },
    // {
    //     path: '/competitive',
    //     name: 'Competidores',
    //     meta: { authRequired: true },
    //     component: () => import('../views/pages/competitive/competitives')
    // },
    {
        path: '/companies',
        name: 'Compañías',
        meta: { authRequired: true },
        component: () => import('../views/pages/company/companies')
    },
    {
        path: '/adjust/users',
        name: 'Usuarios',
        meta: { authRequired: true },
        component: () => import('../views/pages/user/users')
    },
    {
        path: '/analysis/*',
        name: 'Análisis',
        meta: { authRequired: true },
        component: () => import('../views/pages/analysis/analysis')
    },
    {
        path: '/pages/starter',
        name: 'Starter Page',
        meta: { authRequired: true },
        component: () => import('../views/pages/utility/starter')
    },
    {
        path: '/pages/maintenance',
        name: 'Maintenance',
        meta: { authRequired: true },
        component: () => import('../views/pages/utility/maintenance')
    },
    {
        path: '/pages/coming-soon',
        name: 'Coming-soon',
        meta: { authRequired: true },
        component: () => import('../views/pages/utility/coming-soon')
    },
    {
        path: '/pages/timeline',
        name: 'Timeline',
        meta: { authRequired: true },
        component: () => import('../views/pages/utility/timeline/index')
    },
    {
        path: '/pages/faqs',
        name: 'Faqs',
        meta: { authRequired: true },
        component: () => import('../views/pages/utility/faqs')
    },
    {
        path: '/pages/pricing',
        name: 'Pricing',
        meta: { authRequired: true },
        component: () => import('../views/pages/utility/pricing/index')
    },
    {
        path: '/pages/error-404',
        name: 'Error-404',
        meta: { authRequired: true },
        component: () => import('../views/pages/utility/error-404')
    },
    {
        path: '/pages/error-500',
        name: 'Error-500',
        meta: { authRequired: true },
        component: () => import('../views/pages/utility/error-500')
    }
]
