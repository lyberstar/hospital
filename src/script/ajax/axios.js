import axios from 'axios'
axios.interceptors.request.use(config => {
  return config
})
axios.interceptors.response.use(
  response => {
    if (response) {
      return response.data
    }
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 500:
          break
      }
    }
    return error.response
  })

export default axios
