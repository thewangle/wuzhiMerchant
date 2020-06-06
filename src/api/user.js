import axios from 'axios'

//添加新用户
export function addUser(params) {
  let url = process.env.BASE_API + 'yii2/frontend/web/?r=login/adduser'
  return axios.post(url,params)
}

//获取所有用户信息
export function getallUser(params) {
  let url = process.env.BASE_API + 'yii2/frontend/web/?r=login/getallusers'
  return axios.get(url)
}

//根据权限获取用户信息
export function getUserByPermission(params) {
  let url = process.env.BASE_API + 'yii2/frontend/web/?r=login/getalluser'
  return axios.post(url,params)
}

//更新编辑用户信息
export function editeUser(params) {
  let url = process.env.BASE_API + 'yii2/frontend/web/?r=login/editeuser'
  return axios.post(url,params)
}

//删除用户
export function deletUser(params) {
  let url = process.env.BASE_API + 'yii2/frontend/web/?r=login/deleuser'
  return axios.post(url,params)
}

//更新编辑用户到期时间
export function renewalFee(params) {
  let url = process.env.BASE_API + 'yii2/frontend/web/?r=login/renewalfee'
  return axios.post(url,params)
}

//更新编辑用户到期时间
export function changecost(params) {
  let url = process.env.BASE_API + 'yii2/frontend/web/?r=login/changecost'
  return axios.post(url,params)
}

//更新编辑用户到期时间
export function getcost(params) {
  let url = process.env.BASE_API + 'yii2/frontend/web/?r=login/getcost'
  return axios.post(url,params)
}

