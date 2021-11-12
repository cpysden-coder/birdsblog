// const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
require('dotenv').config();
const routes = require('./controllers');
const nodemailer = require('nodemailer');

const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

const hbs = exphbs.create();

const sess = {
  secret: process.env.SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

//define nodemailer transporter
let transporter = nodemailer.createTransport({
  service: "",
  auth: {
    user: "",
    password: ""
  }
})

//define mail options for nodemailer
let mailOption = {
  from: "chris_pysden@mac.com",
  to: "chris_pysden@me.com",
  subject: "email from nodemailer",
  text: "first email sent via nodemailer"
}

//transporter sendMail takes to parameters
transporter.sendMail(mailOption, function(err, success){
  if (err) {
    console.log(err)
  } else {
    console.log("email sent successfully")
  }
})

app.use(session(sess));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(routes);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});