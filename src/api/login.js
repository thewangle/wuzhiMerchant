import axios from 'axios'

//通过username登陆
export function loginByUsername(params) {
  let url = process.env.BASE_API + 'yii2/frontend/web/?r=login/login'
  return axios.post(url,params)
}

//通过username获取userinfo
export function getuserinfoByusername(params) {
  let url = process.env.BASE_API + 'yii2/frontend/web/?r=login/getuserinfo'
  return axios.post(url,params)
}

