import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () => import(/* webpackChunkName: "login_Home" */ '../components/Login.vue')
const Home = () => import(/* webpackChunkName: "login_Home" */ '../components/Home.vue')

const TodoList = () => import(/* webpackChunkName: "TodoList" */ '../components/TodoList.vue')

const Diary = () => import(/* webpackChunkName: "TodoList" */ '../components/diary/Diary.vue')

const New = () => import(/* webpackChunkName: "news" */ '../components/news/New.vue')

const gameHome = () => import(/* webpackChunkName: "games" */ '../components/hobbies/gameWelcome.vue')
// const game2048 = () => import(/* webpackChunkName: "games" */ '../components/hobbies/game2048.vue')
const game20482 = () => import(/* webpackChunkName: "games" */ '../components/hobbies/game2048my.vue')
const gameTanchishe = () => import(/* webpackChunkName: "games" */ '../components/hobbies/gameTanchishe.vue')
const gameChidouzi = () => import(/* webpackChunkName: "games" */ '../components/hobbies/gameChidouzi.vue')

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
  {
    path: '/home',
    component: Home,
    children: [
      { path: '/news', component: New },
      { path: '/todolist', component: TodoList },
      { path: '/diary', component: Diary },
      {
        path: '/game',
        component: gameHome,
        children: [
          // { path: '/game/game2048', component: game2048 },
          { path: '/game/gametanchishe', component: gameTanchishe },
          { path: '/game/gameChidouzi', component: gameChidouzi },
          { path: '/game/game20482', component: game20482 }
        ]
      }
    ],
    redirect: '/news'
  }
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
