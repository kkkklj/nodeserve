//需要token的白名单
module.exports = {
  // code: {
  //   key: 'code',
  //   title: '验证码的token验证',
  //   url: ['/register', '/modifyPwd']
  // },

  //默认为登录验证
  default: {
    key: 'login',
    title: '登录的token验证',
    url: ['/user','/collection','/getcollection']
  }
}