module.exports = {
  plugins: {
    autoprefixer: {},
    // 只是 px to rem 配置
    // 同时 需要一个插件 amfe
    'postcss-pxtorem': {
      // 换算rem基准值 标准设备iphone6 宽度375
      // 但是设计稿是750px 缩小一倍
      rootValue: 37.5,
      propList: ['*']
    }
  }

}
