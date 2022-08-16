const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath:"./",
  transpileDependencies: true,
  lintOnSave:false,
  devServer: {
    proxy: {
        // /api 表示请求前缀
      '/api': {
            target: 'http://localhost:8085',
          
          //pathRewrite路径重写，其中有两个参数键值对，第一个写 正则匹配条件，第二个表示 写成什么
            pathRewrite: { '^/api': '' },
            ws: true, //用于支持websocket
            changeOrigin: true, //用于控制请求头中host值(为true时，其请求端口值和后台服务器一样（撒谎）;为false时，请求端口值和代理服务器端口一致(诚实))
        },
    }
  }

})
