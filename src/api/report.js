import axios from 'axios'

//根据用户id获取该id下的所有用户信息
export function getallUserByidthis(params) {
  let url = process.env.BASE_API + 'yii2/frontend/web/?r=login/getallusersbyidthis'
  return axios.post(url,params)
}

//获取今日或昨日经营状况 -- 用于首页经营状况展示
export function getruninfo(params) {
  let url = process.env.BASE_API + 'yii2/frontend/web/?r=report/getruninfo'
  return axios.post(url,params)
}

//获取今日或昨日之最 -- 用于首页今日之最
export function getmostone(params) {
  let url = process.env.BASE_API + 'yii2/frontend/web/?r=report/getmostone'
  return axios.post(url,params)
}