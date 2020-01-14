let routeControllor=require(__basename+'/route_controllor/route_controllor.js');
module.exports=app=>{
  app.use(routeControllor.vtoken);
  app.post('/register',routeControllor.register)
  // app.get('/register',routeControllor.getres)
  app.post('/login',routeControllor.login)
  app.post('/user',routeControllor.user)
  app.post('/collection',routeControllor.collectionNews)
  app.post('/getcollection',routeControllor.getcollection)
}