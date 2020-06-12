import axios from 'axios'
// debug表示是否是线上环境，true表示本地环境，false表示线上环境
const debug = process.env.NODE_ENV !== 'production'
let baseURL
if (debug) {
  baseURL = '/app/'
} else {
  // baseURL = '根据实际情况判断测试环境还是正式环境'
}

const ajax = axios.create({
  baseURL: baseURL
})

export const UpIdCard = (params) => {
  var url = 'examined/getUserByCard'
  return ajax.post(url, params)
}

export const UpPhone = (params) => {
  var url = 'examined/sendCode'
  return ajax.post(url, params)
}

export const GetNewsList = (params) => {
  var url = 'examined/getUserCategory'
  return ajax.get(url, params)
}
