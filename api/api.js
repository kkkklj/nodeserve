class API{
  //添加记录
  createData(modelName, o) {
    //modelName: 模型
    //o: 写入数据
    return Model[modelName].create(o);
  }
  //查询数据
  findData(modelName, condition, attributes) {
    //modelName：模型
    //condition: 查询条件
    //attributes: 查询字段
    return Model[modelName].findAll({

      //condition: 查询条件
      where: condition,

      //attributes: 查询字段
      attributes
    });
  }
   //删除数据
  destroyData(modelName, condition) {
    //modelName: 模型名称, 类型string
    //condition: 条件， 类型object
    return Model[modelName].destroy(
      {
        where: condition
      }
    );
  }
}
module.exports = new API();