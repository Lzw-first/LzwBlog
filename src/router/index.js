import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () => import(/* webpackChunkName: "login_Home" */ '../components/Login.vue')
const Home = () => import(/* webpackChunkName: "login_Home" */ '../components/Home.vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  { path: '/home', component: Home }
]

const router = new VueRouter({
  routes
})

// 拦截器
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()

  if (!window.sessionStorage.getItem('token')) {
    return next('/login')
  }
  next()
})

export default router
