let Sequelize=require('sequelize');
let Model=Sequelize.Model;
class Usernews extends Model{};
//新闻收藏
Usernews.init({
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
  userId:{
    type: Sequelize.STRING(18),
    allowNull: false,
    defaultValue: '',
    comment: '用户唯一id'
  },
  title:{
    type:Sequelize.STRING(64),
    allowNull:false,
    defaultValue:'',
    comment:'标题'
  },
  imgList:{
    type:Sequelize.STRING(160),
    allowNull:false,
    defaultValue:'',
    comment:'图片地址'
  },
  source:{
    type:Sequelize.STRING(50),
    allowNull:false,
    defaultValue:'',
    comment:'来源'
  },
  newsId:{
    type:Sequelize.STRING(32),
    allowNull:false,
    defaultValue:'',
    comment:'用户id'
  },
  postTime:{
    type:Sequelize.STRING(28),
    allowNull:false,
    defaultValue:'',
    comment:'来源'
  }
},{
  modelName:'usernews',
  underscored:true,
  tableName:'usernews',
  timestamps:true,
  sequelize
})
Usernews.sync({force:false});
module.exports=Usernews;