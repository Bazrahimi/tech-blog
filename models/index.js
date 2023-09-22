const User = require('./user');
const BlogPost = require('./BlogPost');

// A user can have many blog posts, but each blog post can belong to one user
User.hasMany(BlogPost, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});

BlogPost.belongsTo(User, {
  foreignKey: 'user_id',
});

module.exports = { User, BlogPost };
