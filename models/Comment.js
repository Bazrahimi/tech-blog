const { Model, DataTypes } = require('sequelize');  // import the sequelize constructor and DataTypes object from the Sequelize library
const sequelize = require('../config/connection');  
class Comment extends Model {}  

Comment.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  comment_text:{
    type: DataTypes.STRING,
    allowNull: false
  },
  user_id:{
    type: DataTypes.INTEGER,
    allowNull: false,
    references:{
      model: 'user',
      key: 'id'
    }
  },
  post_id:{
    type: DataTypes.INTEGER,
    allowNull: false,
    references:{
      model: 'post',
      key: 'id'
    }
  },



}, {
  sequelize,
  freezeTableName: true,
  underscored: true,
  modelName: 'comment'
});


module.exports = Comment;