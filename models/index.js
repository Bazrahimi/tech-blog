const User = require('./User/index.js');
const Post = require('./Post/index.js');
const Comment = require('./Comment/index.js');
// create associations
User.hasMany(Post, {
  foreignKey: 'user_id'
});
Post.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'SET NULL'
}); 
Comment.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'SET NULL'
});
Comment.belongsTo(Post, {
  foreignKey: 'post_id',
  onDelete: 'SET NULL'
});
User.hasMany(Comment, {
  foreignKey: 'user_id',
  onDelete: 'SET NULL'
});
Post.hasMany(Comment, {
  foreignKey: 'post_id'
});
module.exports = { User, Post, Comment }; 
// Path: controllers/api/index.js