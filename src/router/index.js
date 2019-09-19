import Vue from 'vue'
import Router from 'vue-router'
import login from '../view/login'
import index from '../view/index'
import goodslist from '../view/goods/goodslist'
import goodsout from '../view/goods/goodsout'
import goodsin from '../view/goods/goodsin'
import goodsprice from '../view/goods/goodsprice'
import addgoods from '../view/goods/addgoods'
import sort from '../view/goods/sort'
import addmember from '../view/member/addmember'
import memberlist from '../view/member/memberlist'
import supplierlist from '../view/supplier/supplierlist'
import addsupplier from '../view/supplier/addsupplier'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: '/m/',
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/index',
      name: 'index',
      component: index
    },
    {
      path: '/addgoods',
      name: 'addgoods',
      component: addgoods
    },
    {
      path: '/goodslist',
      name: 'goodslist',
      component: goodslist
    },
    {
      path: '/addmember',
      name: 'addmember',
      component: addmember
    },
    {
      path: '/memberlist',
      name: 'memberlist',
      component: memberlist
    },
    {
      path: '/supplierlist',
      name: 'supplierlist',
      component: supplierlist
    },
    {
      path: '/addsupplier',
      name: 'addsupplier',
      component: addsupplier
    },
    {
      path: '/sort',
      name: 'sort',
      component: sort
    },
    {
      path: '/goodsout',
      name: 'goodsout',
      component: goodsout
    },
    {
      path: '/goodsin',
      name: 'goodsin',
      component: goodsin
    },
    {
      path: '/goodsprice',
      name: 'goodsprice',
      component: goodsprice
    },
  ]
})
