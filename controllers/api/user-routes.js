const router = require('express').Router();
const { User } = require('../../models');

// CREATE new user
router.post('/signup', async (req, res) => {
  
  try {
    const dbUserData = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    req.session.save(() => {
      req.session.loggedIn = true;
      res.redirect('/dashboard');
      
      res.status(200).json(dbUserData);
    });
  } catch (err) {
    console.log(err);
    res.render('signup', { message: 'Something went wrong. Please try again!' });
  }
});

// login route
router.post('/login', async (req, res) => {
  try {
    const dbUserData = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!dbUserData) {
      res.status(400).json({ message: 'Incorrect email or password. Please try again!'});
      return;
    }

    const validPassword = await dbUserData.checkPassword(req.body.password);

    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect email or password. Please try again!'});
      return;
    }

    req.session.save(() => {
      req.session.loggedIn = true;
      // Only send one response back - in this case, the JSON object.
      res.status(200).json({ user: dbUserData, message: 'You are now logged in!'});
    });

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});



// logout route
router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

router.get('/login', (req, res) => {
  console.log(req.session); // Debugging line
  if (req.session && req.session.loggedIn) {
    res.redirect('/dashboard');
  } else {
    res.render('login');
  }
});



module.exports = router;