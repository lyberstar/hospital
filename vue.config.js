/* eslint-disable */
const webpack = require('webpack')
const $path = require('path')
function resolve(dir) {
  return $path.resolve(__dirname, dir)
}
module.exports = {
  publicPath: '',
  lintOnSave: true,
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('components', resolve('src/components'))
      .set('@ajax', resolve('src/script/ajax/Interface'))
  },
  devServer: {
    port: 8088,
    proxy: {
      '/app': {
        // target: 'http://xwcds.lyta.gov.cn',//设置你调用的接口域名和端口号 别忘了加http
        target: 'http://139.155.94.28',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
      '/api': {
        // target: 'http://xwcds.lyta.gov.cn',//设置你调用的接口域名和端口号 别忘了加http
        target: 'http://app.xiantudi.cn',
        changeOrigin: true,
        pathRewrite: {
          '^/app': ''
        }
      }
    },
    disableHostCheck: true
  },
  configureWebpack: {
    devtool: 'source-map'
  },
  // eslint-disable-next-line no-dupe-keys
  configureWebpack: {
    plugins: []
  }
}
