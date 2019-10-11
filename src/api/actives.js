import axios from 'axios'

//添加新活动
export function addactives(params) {
  let url = process.env.BASE_API + 'yii2/frontend/web/?r=merchantactives/addactives'
  return axios.post(url,params)
}

//获取七牛云token
export function getqiniutoken(params) {
  let url = process.env.BASE_API + 'yii2/frontend/web/?r=merchantactives/getqiniutoken'
  return axios.post(url,params)
}

//根据用户id获取该用户下的活动
export function getallactivesbyid(params) {
  let url = process.env.BASE_API + 'yii2/frontend/web/?r=merchantactives/getallactivesbyid'
  return axios.post(url,params)
}

//更改活动信息
export function editeactive(params) {
  let url = process.env.BASE_API + 'yii2/frontend/web/?r=merchantactives/editeactive'
  return axios.post(url,params)
}

//删除活动信息
export function deletactive(params) {
  let url = process.env.BASE_API + 'yii2/frontend/web/?r=merchantactives/deletactive'
  return axios.post(url,params)
}