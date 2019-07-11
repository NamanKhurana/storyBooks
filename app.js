const express = require('express');
const exphbs = require('express-handlebars')
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const session = require("express-session")
const passport = require('passport')

//Passport config
require('./config/passport')(passport)

const keys = require('./config/keys')

//MAP GLOBAL PROMISES
mongoose.Promise = global.Promise

//Mongoose CONNECT
mongoose.connect(keys.mongoURI, {
    useNewUrlParser: true
}).then(() => console.log('MONGODB connected'))
    .catch(err => console.log(err))

const app = express();

//Handlebars Middleware
app.engine('handlebars',exphbs({
    defaultLayout:'main'
}))

app.set('view engine','handlebars')

//Express-Session Middleware
app.use(cookieParser())
app.use(session({
    secret:'secret',
    resave:false,
    saveUninitialized:false
}))

//Passport Middleware
app.use(passport.initialize())
app.use(passport.session())

//SET GLOBAL VARS
app.use((req,res,next) => {
    res.locals.user = req.user || null
    next()
})

//Use Routes
app.use('/auth', require('./routes/auth'))
app.use('/', require('./routes/index'))

const port = process.env.PORT || 5001;

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})

