const router = require('express').Router();
const { User, BlogPost }= require('../models');


// GET all users
router.get('/', async (req, res) => {
  try {
    const dbUserData = await User.findAll({
      attributes: { exclude: ['password'] }  // Exclude password from the data sent to client
    });
    res.render('main', { dbUserData })
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});