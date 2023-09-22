
// Import required libraries and modules
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// New BlogPost model
class BlogPost extends Model {}

// Initialize the BlogPost Model
BlogPost.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // Foreign key to associate a blog post with a user
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',  // NOTE: this should match the `modelName` of your User model
        key: 'id',
      },
    },
  },
  {
    sequelize,
    timestamps: true,  // Set to true to use Sequelize's built-in createdAt and updatedAt
    freezeTableName: true,
    underscored: true,
    modelName: 'blogpost',  // Set the model name to 'blogpost'
  }
);

module.exports = BlogPost;
