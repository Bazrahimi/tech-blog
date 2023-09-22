// import required modules and libraries 
const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');

// store session
const SequelizeStore = require('connect-session-sequelize')(session.Store);

