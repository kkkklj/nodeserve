let utils=require(__basename+'/utils/utils.js');
let api=require(__basename+'/api/api.js');
let list = require(__basename + '/list/list.js');
class RouterControllor{
  vtoken(req,res,next){
    // console.log(req.body)
    let requestType = req.method == 'GET' ? 'query' : 'body';
    let params = req[requestType];
    // console.log(params)
    //不在拦截名单放行
    if (!params.key) {
      return next();
    }
    console.log(params.key)
    //请求路由包含于该名单目录
    if(!list[params.key]){
      console.log('参数错误')
      return res.send({msg:'参数错误'})
    }
    if(list[params.key].url.indexOf(req.url) > -1){
      let cookieData = utils.transformCookieObject(req.headers.cookie);
      //没有cookie则拦截
      if(!cookieData){
        return res.send({msg:'用户未登录',type:'未携带cookie'})
      }
      //以下两项在需要拦截多种类型路由的时候可以动态赋予，需要list名单对象对象提供相关信息
      //cookie中token名字
      let tkName='_utk';
      //token盐
      let salt=config.salitOption.login;
      console.log('===>',cookieData)
      utils.validToken(cookieData[tkName],salt,(err,decode)=>{
        //token验证失败,作为代码最后不需要return,因为res.send如果存在多个会报错
        if(err){
          res.send({msg:'用户卫登录',type:'token拦截'})
        }else{
          next();
        }
      })

    }
  }
  //注册
  register(req,res){
    console.log('register...')
    //接收到的数据
    console.log('body====>',req.body.userName,'====>',req.body.passWord)
    //用户名
    let userName=req.body.userName;
    //密码
    let passWord=req.body.passWord;
    

    //查询是否存在该用户
    api.findData('user',{
      userName:userName
    },['userName']).then(result=>{
      if(result[0]){
        res.send({msg:'该用户已被注册'})
      }else{
        //加密
        passWord=utils.encodeString(passWord);
        res.send({msg:'可以注册'})
        //插入数据
        let userId=config.salitOption.userIdSalt+new Date().getTime();
        api.createData('user',{
          userName,
          passWord,
          userId
        }).then(result=>{
          res.send({msg:'添加数据成功'})
        }).catch(err=>{
          res.send({msg:'出错'})
        })
      }
    })
  }
  //登录
  login(req,res){
    //用户名
    let userName=req.body.userName;
    //密码
    let passWord=req.body.passWord;

    api.findData('user',{
      userName:userName
    },['userName','passWord','userId']).then(result=>{
      if(result[0]){
        passWord=utils.encodeString(passWord);
        if(passWord!=result[0].passWord){
          res.send({msg:'密码错误',status:403})
          // return;
        }else{
          //根据userId生成token凭证
          let _utk = utils.getToken(result[0].userId,config.salitOption.login,'1d');
          res.send({msg:'登录成功',utk:'',_utk,status:200});
         
          // return;
        }
        // res.send(result[0]);
      }else{
        res.send({msg:'用户名不存在',status:404})
        // return;
      }
    })
  }
  //用户状态，是否登录
  user(req,res){
    // console.log(req.headers.cookie);
    let tk=req.headers.cookie;
    if(tk){
      tk=utils.transformCookieObject(tk)._utk;
      utils.validToken(tk,config.salitOption.login,(err,decode)=>{
        if(err){
          res.send('无登录')
        }else{
          // console.log(decode.data)
          let userId=decode.data
          api.findData('user',{
            userId
          },['userName']).then(result=>{
            res.send({userName:result[0].userName})
          })
        }
      })
    }else{
      res.send({msg:'用户未登录'})
    }
    
    console.log(tk)
  }
  getres(req,res){
    console.log('shoudao');
    res.send('111')
  }

  //收藏新闻
  collectionNews(req,res){
    //cookie
    let cookie=req.headers.cookie;
    //token
    let tk=utils.transformCookieObject(cookie)._utk;

    // let data=req.body;
    // console.log(data);
    let id;
    let data=JSON.parse(req.body.data);
    data.imgList=data.imgList[0];
    // if(data.imgList[0]===undefined){
    //   data.imgList=data.imgList;
    // }
    delete data.digest;
    delete data.videoList;
    console.log('data====>0',data)
    //获取用户id
    utils.validToken(tk,config.salitOption.login,(err,decode)=>{
      if(err){
        res.send('无登录')
      }else{
        // console.log(decode.data)
        id=decode.data;
      }
    })
    data.userId=id;
    console.log(data)
    if(data.postTime===null){
      data.postTime=''
    }
    new Promise((reslove,reject)=>{
      api.findData('usernews',{
        userId:id,
        newsId:data.newsId
      }).then(result=>{
        console.log('凝固',result);
        //凝固
        reslove(result)
      })
    }).then(result=>{
      if(result[0]){
        console.log('重复提交')
        api.destroyData("usernews",{
          newsId:data.newsId
        }).then(delres=>{
        return res.send({msg:'删除成功',star:'star-o'})
        }).catch(err=>{
          return res.send({msg:'删除失败',star:'star'})
        })
        
      }else{
        api.createData('usernews',
          data
        ).then(result=>{
          res.send({msg:'添加数据成功',star:'star'})
        }).catch(err=>{
          res.send({msg:'出错'})
        })
      }
    })


    // api.findData('usernews',{
    //   userId:id,
    //   newsId:data.newsId
    // }).then(result=>{
    //   if(result[0]){
    //     console.log('重复提交')
    //     api.destroyData("usernews",{
    //       newsId:data.newsId
    //     }).then(delres=>{
    //     return res.send({msg:'删除成功',star:'star-o'})
    //     }).catch(err=>{
    //       return res.send({msg:'删除失败',star:'star'})
    //     })
        
    //   }else{
    //     api.createData('usernews',
    //       data
    //     ).then(result=>{
    //       res.send({msg:'添加数据成功',star:'star'})
    //     }).catch(err=>{
    //       res.send({msg:'出错'})
    //     })
    //   }
    // })
    
    
  }
  getcollection(req,res){
    //cookie
    let cookie=req.headers.cookie;
    //token
    let tk=utils.transformCookieObject(cookie)._utk;

    let id;
    utils.validToken(tk,config.salitOption.login,(err,decode)=>{
      if(err){
        res.send('无登录')
      }else{
        // console.log(decode.data)
        id=decode.data;
        // res.send({id})
      }
    })
    api.findData('usernews',{
      userId:id
    },['title','imgList','source','newsId','postTime']).then(result=>{
      res.send(result);
    })
  }
  //文章是否被收藏
}
module.exports=new RouterControllor();