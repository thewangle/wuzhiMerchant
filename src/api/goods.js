import axios from 'axios'

//添加新会员
export function addSort(params) {
  let url = process.env.BASE_API + 'yii2/frontend/web/?r=goods/addsort'
  return axios.post(url,params)
}

//根据用户id获取memberinfo--用于table展示
export function getSortinfo(params) {
  let url = process.env.BASE_API + 'yii2/frontend/web/?r=goods/getsortinfo'
  return axios.post(url,params)
}

//根据用户id获取memberinfo--用于分类select选择
export function getSortinfoall(params) {
  let url = process.env.BASE_API + 'yii2/frontend/web/?r=goods/getsortinfoall'
  return axios.post(url,params)
}

//根据分类id获取sortinfo--用于商品列表选择
export function getSortinfoone(params) {
  let url = process.env.BASE_API + 'yii2/frontend/web/?r=goods/getsortinfoone'
  return axios.post(url,params)
}

//编辑menmberinfo
export function editeSortinfo(params) {
  let url = process.env.BASE_API + 'yii2/frontend/web/?r=goods/editsortinfo'
  return axios.post(url,params)
}

//根据会员id删除会员
export function deleteSort(params) {
  let url = process.env.BASE_API + 'yii2/frontend/web/?r=goods/deletesort'
  return axios.post(url,params)
}

//根据用户id获取memberinfo--用于分类select选择
export function getSupplierall(params) {
  let url = process.env.BASE_API + 'yii2/frontend/web/?r=goods/getsupplierall'
  return axios.post(url,params)
}

//添加新商品
export function addGoods(params) {
  let url = process.env.BASE_API + 'yii2/frontend/web/?r=goods/addgoods'
  return axios.post(url,params)
}

//根据分类id获取goodsinfo
export function getGoodsinfo(params) {
  let url = process.env.BASE_API + 'yii2/frontend/web/?r=goods/getgoodsinfo'
  return axios.post(url,params)
}

//编辑Goodsinfo
export function editeGoodsinfo(params) {
  let url = process.env.BASE_API + 'yii2/frontend/web/?r=goods/editegoodsinfo'
  return axios.post(url,params)
}

//根据会员id删除商品
export function deletegoodsinfo(params) {
  let url = process.env.BASE_API + 'yii2/frontend/web/?r=goods/deletgoods'
  return axios.post(url,params)
}

