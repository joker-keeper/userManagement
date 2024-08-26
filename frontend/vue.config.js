module.exports = {
  devServer: {
    port: 8081, // 设置前端服务器运行在 8080 端口
    proxy: 'http://localhost:8080'
  },
  chainWebpack: config => {
    config.module
      .rule('js')
      .test(/\.js$/)
      .exclude.add(/node_modules/)
      .end()
      .use('babel-loader')
      .loader('babel-loader')
      .options({
        presets: ['@babel/preset-env']
      });
  }
}
