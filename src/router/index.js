import Vue from 'vue'
import Router from 'vue-router'
import Fractions from '../components/routes/Fractions'
import Sockets from '../components/routes/Sockets'

const Index = () => import('../components/routes')

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/fractions',
      name: 'fractions',
      component: Fractions
    },
    {
      path: '/sockets',
      name: 'sockets',
      component: Sockets
    }
  ]
})
