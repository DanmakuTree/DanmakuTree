import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home'
import Home2 from '../views/Home2'
// import API from '../views/API'
import roomlist from '../views/roomlist'
import History from '../views/History'
import Main from '../views/Main'
import notFound from '../views/404'
// import Plugin from '../views/Plugin'
import RouteLoading from '../components/RouteLoading'
import RouteError from '../components/RouteError'
Vue.use(Router)

/**
 * 处理路由页面切换时，异步组件加载过渡的处理函数
 * @param  {Object} AsyncView 需要加载的组件，如 import('@/components/home/Home.vue')
 * @return {Object} 返回一个promise对象
 */
function lazyLoadView (AsyncView) {
  console.log('loading...')
  const AsyncHandler = () => ({
    // 需要加载的组件 (应该是一个 `Promise` 对象)
    component: AsyncView,
    // 异步组件加载时使用的组件
    loading: RouteLoading,
    // 加载失败时使用的组件
    error: RouteError,
    // 展示加载时组件的延时时间。默认值是 200 (毫秒)
    delay: 200,
    // 如果提供了超时时间且组件加载也超时了，
    // 则使用加载失败时使用的组件。默认值是：`Infinity`
    timeout: 1000
  })
  return Promise.resolve({
    functional: true,
    render (h, { data, children }) {
      return h(AsyncHandler, data, children)
    }
  })
}

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/main/home'
    },
    {
      path: '/plugin',
      component: () => lazyLoadView(import('../components/plugins/danmaku/index'))
    },
    {
      path: '/main',
      component: Main,
      children: [
        {
          path: 'home',
          meta: {
            title: '首页',
            icon: 'fa-home'
          },
          component: Home2
        },
        {
          path: 'history',
          meta: {
            title: '弹幕历史'
          },
          component: History
        },
        {
          path: 'roomlist',
          meta: {
            title: '房间列表'
          },
          component: () => lazyLoadView(import('../views/roomlist'))
        },
        {
          path: '*',
          component: notFound
        }
      ]
    },
    {
      path: '*',
      redirect: '/main/home'
    }
  ]
})

// dynamically set application title to current view
router.afterEach((to) => {
  let title =
    to.path === '/home'
      ? process.env.PRODUCT_NAME
      : `${to.meta.title} - ${process.env.PRODUCT_NAME}`

  if (!title) {
    title = 'Home'
  }

  document.title = title
})

export default router
