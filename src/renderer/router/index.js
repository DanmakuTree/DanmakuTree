import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home'
import Roomlist from '../views/Roomlist'
import ModuleView from '../views/ModuleView'
import ModuleCenter from '../views/ModuleCenter'
import History from '../views/History'
import notFound from '../views/Error'
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
      redirect: '/home'
    },
    {
      path: '/plugin',
      component: () => lazyLoadView(import('../components/plugins/danmaku/index'))
    },
    {
      path: '/home',
      meta: {
        title: '首页',
        icon: 'fa-home'
      },
      component: Home
    },
    {
      path: '/history',
      meta: {
        title: '弹幕历史'
      },
      component: History
    },
    {
      path: '/roomlist',
      meta: {
        title: '房间列表'
      },
      component: () => lazyLoadView(import('../views/Roomlist'))
    },
    {
      path: '/moduleCenter',
      meta: {
        title: '插件中心'
      },
      component: ModuleCenter
    },
    {
      path: '/module/:id',
      meta: {
        title: 'test'
      },
      component: ModuleView
    },
    {
      path: '*',
      component: notFound
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
