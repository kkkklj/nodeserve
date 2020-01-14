let express=require('express');

console.log(111);
global.__basename=__dirname;
console.log(__basename);
global.config = require(__basename + '/config/config.js');
let bodyParser=require('body-parser');
let route=require(__basename+'/route/route.js');
global.sequelize=require(__basename+'/db/db_config/db_config.js');
var cors=require('cors');

global.Model=require(__basename+'/db/model/model.js');
//解析post请求体
//extended: false表示可以接收任何数据类型请求体


let app=express();

app.use(bodyParser.urlencoded({
  extended: false,

  //允许post请求体最大大小为3MB
  limit: '1024kb'
}));
app.use(cors({
  origin:[config.geturl.url+':8080'],  //指定接收的地址
  methods:['GET','POST'],  //指定接收的请求类型
  alloweHeaders:['Content-Type','Authorization']  //指定header
}))
app.all('*', (req, res, next) => {
  // *: 任何域都可访问
  // res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Origin", config.geturl.url+":8080");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  //该字段可选。它的值是一个布尔值，表示是否允许发送Cookie。默认情况下，Cookie不包括在CORS请求之中。设为true，即表示服务器明确许可，Cookie可以包含在请求中，一起发给服务器。这个值也只能设为true，如果服务器不要浏览器发送Cookie，删除该字段即可
  res.header('Access-Control-Allow-Credentials', true);

  next();
})
route(app);
app.listen('10005',()=>{
  console.log('server running')
})