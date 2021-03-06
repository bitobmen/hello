import store from '@state/store';

export default [
  {
    path: '/',
    name: 'home',
    component: () => lazyLoadView(import('@views/home')),
    meta: {
      authRequired: true,
    },
    props: (route) => ({ user: store.state.auth.currentUser || {} }),
  },
  {
    path: '/login',
    name: 'login',
    component: () => lazyLoadView(import('@views/login')),
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
    component: () => lazyLoadView(import('@views/register')),
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
    path: '/confirm-account',
    name: 'confirm-account',
    component: () => lazyLoadView(import('@views/confirm')),
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
    path: '/forget-password',
    name: 'forget-password',
    component: () => lazyLoadView(import('@views/forgetPassword')),
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
        store.dispatch('auth/logOut');
        const authRequiredOnPreviousRoute = routeFrom.matched.some(
          (route) => route.meta.authRequired
        );
        // Navigate back to previous page, or home as a fallback
        next(authRequiredOnPreviousRoute ? { name: 'home' } : { ...routeFrom })
      },
    },
  },
  {
    path: '/404',
    name: '404',
    component: require('@views/_404').default,
    // Allows props to be passed to the 404 page through route
    // params, such as `resource` to define what wasn't found.
    props: true,
  },
  // Redirect any unmatched routes to the 404 page. This may
  // require some server configuration to work in production:
  // https://router.vuejs.org/en/essentials/history-mode.html#example-server-configurations
  {
    path: '*',
    redirect: '404',
  },
  {
    path: '/sellers/create',
    name: 'CreateSeller',
    component: () => lazyLoadView(import('@views/sellers/create')),
    meta: {
      authRequired: true,
    },
  },
  {
    path: '/sellers/card',
    name: 'CardSeller',
    component: () => lazyLoadView(import('@views/sellers/show')),
    meta: {
      authRequired: true,
    },
  },
  {
    path: '/sellers/update',
    name: 'UpdateSeller',
    component: () => lazyLoadView(import('@views/sellers/edit')),
    meta: {
      authRequired: true,
    },
  },
  {
    path: '/sellers',
    name: 'IndexSellers',
    component: () => lazyLoadView(import('@views/sellers/index')),
    meta: {
      authRequired: true,
    }
  },
  {
    path: '/orders',
    name: 'index-orders',
    component: () => lazyLoadView(import('@views/orders/index')),
    meta: {
      authRequired: true,
      async beforeResolve(routeTo, routeFrom, next) {
        try {
          await store.dispatch('order/getStatus');
          await store.dispatch('order/getSellers');
        } catch (e) {

        }
        next();
      },
    },
    props: (route) => ({page: route.query.page || 1}),
  },

  {
    path: '/orders/show/:id',
    name: 'show-orders',
    component: () => lazyLoadView(import('@views/orders/show')),
    meta: {
      authRequired: true,
      async beforeResolve(routeTo, routeFrom, next) {
        try {
          await store.dispatch('order/getStatus');
        } catch (e) {

        }
        next();
      },
    },
    props: (route) => ({page: route.query.page || 1}),
  },

  {
    path: '/statistic',
    name: 'statistic.index',
    component: () => lazyLoadView(import('@views/statistic/index')),
    meta: {
      authRequired: true,
      async beforeResolve(routeTo, routeFrom, next) {
        try {
          await store.dispatch('statistic/getStatus');
          await store.dispatch('statistic/getSellers');
        } catch (e) {

        }
        next();
      },
    }
  },
]

// Lazy-loads view components, but with better UX. A loading view
// will be used if the component takes a while to load, falling
// back to a timeout view in case the page fails to load. You can
// use this component to lazy-load a route with:
//
// component: () => lazyLoadView(import('@views/my-view'))
//
// NOTE: Components loaded with this strategy DO NOT have access
// to in-component guards, such as beforeRouteEnter,
// beforeRouteUpdate, and beforeRouteLeave. You must either use
// route-level guards instead or lazy-load the component directly:
//
// component: () => import('@views/my-view')
//
function lazyLoadView(AsyncView) {
  const AsyncHandler = () => ({
    component: AsyncView,
    // A component to use while the component is loading.
    loading: require('@views/_loading').default,
    // Delay before showing the loading component.
    // Default: 200 (milliseconds).
    delay: 400,
    // A fallback component in case the timeout is exceeded
    // when loading the component.
    error: require('@views/_timeout').default,
    // Time before giving up trying to load the component.
    // Default: Infinity (milliseconds).
    timeout: 10000,
  });

  return Promise.resolve({
    functional: true,
    render(h, { data, children }) {
      // Transparently pass any props or children
      // to the view component.
      return h(AsyncHandler, data, children)
    },
  })
}
