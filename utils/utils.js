let crypto=require('crypto');
let jsonwebtoken=require('jsonwebtoken');
class Utils{
  //md5加密
  encodeString(val){
    let password=val+config.salitOption.password;
    let md5=crypto.createHash('md5');
    md5.update(password);
    return md5.digest('hex');
  }

  //将cookie转换为普通对象
  transformCookieObject(value) {

    if (value) {
      let cookieObject = {};
      value = value.split(/; /);
      for (let i = 0; i < value.length; i++) {
        let v = value[i].split('=');
        cookieObject[v[0]] = v[1];
      }

      return cookieObject;
    }

    return null;
    
  }
  //生成token
  getToken(val,salt,time){
    let codeToken=jsonwebtoken.sign({
      data:val
    },salt,{expiresIn:time});
    return codeToken;
  }
  //验证token
  validToken(token,salt,fn){
    return jsonwebtoken.verify(token,salt,fn);
  }

  
}
module.exports=new Utils();