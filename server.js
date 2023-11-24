// import required modules and libraries 
require('dotenv').config();
const moment = require('moment');


const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');




const routes = require('./controllers');

const sequelize = require('./config/connection');

const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
    secret: process.env.DB_SECRET,
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize,
        checkExpirationInterval: 1000 * 60 * 10, // will check every 10 minutes
        expiration: 1000 * 60 * 30 // will expire after 30 minutes
    })
};

const app = express();
const PORT = process.env.PORT || 3001;



const hbs = exphbs.create({
  helpers: {
    moment: function (date, format) {
      return moment(date).fromNow();
    },
  },
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

const methodOverride = require('method-override');
app.use(methodOverride('_method'));




app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(sess));
app.use(routes);

app.get('/', (req, res) => {

  res.render('homepage', { 
    layout: 'main', // Assuming 'main' is your main layout file
    loggedIn: req.session?.loggedIn || false // Safely access loggedIn property
  });
});

app.use(routes);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () =>
    console.log(
      `\nServer running on port ${PORT}. Visit http://localhost:${PORT} and create an account!`
    )
  );
});