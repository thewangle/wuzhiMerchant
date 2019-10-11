import router from '../router'
import Vue from 'vue'
import { getToken, getRoleId, getUserName } from '@/utils/cookie' // getToken from cookie
// import axios from 'axios'

const whiteList = ['/'] // no redirect whitelist
router.beforeEach(async(to, from, next) => {
  // if (to.path != '/' && Number(whiteList.indexOf(to.path)) < 0) {
  //   if (getRoleId() != 3) {
  //     next({ name: 'login' })
  //   } else {
  //     next()
  //   }
  // }
  if (getToken() == 'lexiangyuedong') { // determine if there has token
    next()
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) != -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next('/') // 否则全部重定向到登录页
    }
  }
})

router.afterEach(() => {
  // do some thing
})
