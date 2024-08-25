module.exports = {
  devServer: {
    port: 8081, // 设置前端服务器运行在 8080 端口
    proxy: 'http://localhost:8080'
  }
}
