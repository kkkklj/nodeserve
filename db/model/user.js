let Sequelize=require('sequelize');
let Model=Sequelize.Model;
class User extends Model{};
User.init({
  id: {
    //字段类型
    //INTEGER: 整型， UNSIGNED: 无符号
    type: Sequelize.INTEGER.UNSIGNED,

    //是否为空
    allowNull: false,

    //自动递增
    autoIncrement: true,

    //主键
    primaryKey: true,

    //注释
    comment: '表的主键id'
  },
  userName:{
    type:Sequelize.STRING(40),
    allowNull:false,
    comment:'用户名'
  },
  passWord:{
    type:Sequelize.STRING(40),
    allowNull:false,
    comment:'密码'
  },
  userId:{
    type: Sequelize.STRING(18),
    allowNull: false,
    defaultValue: '',
    comment: '用户唯一id'
  }
},{
  modelName:'user',
  underscored:true,
  tableName:'user',
  timestamps:true,
  sequelize
})
User.sync({force:false});
module.exports=User;