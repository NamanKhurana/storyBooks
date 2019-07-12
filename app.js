const express = require('express');
const path = require('path')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const session = require("express-session")
const passport = require('passport')

//Passport config
require('./config/passport')(passport)

//Load Keys
const keys = require('./config/keys')

//Handlebars Helpers
const {
    truncate,
    stripTags,
    formatDate,
    select,
    editIcon
} = require('./helpers/hbs')

//MAP GLOBAL PROMISES
mongoose.Promise = global.Promise

//Mongoose CONNECT
mongoose.connect(keys.mongoURI, {
    useNewUrlParser: true
}).then(() => console.log('MONGODB connected'))
    .catch(err => console.log(err))

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

//Method Override (used for put and delete request using forms)
app.use(methodOverride('_method'))

//Handlebars Middleware
app.engine('handlebars', exphbs({
    helpers: {
        truncate: truncate,
        stripTags: stripTags,
        formatDate:formatDate,
        select:select,
        editIcon:editIcon
    },
    defaultLayout: 'main'
}))

app.set('view engine', 'handlebars')

//Express-Session Middleware
app.use(cookieParser())
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}))

//Passport Middleware
app.use(passport.initialize())
app.use(passport.session())

//SET GLOBAL VARS
app.use((req, res, next) => {
    res.locals.user = req.user || null
    next()
})

//SET STATIC FOLDER
app.use(express.static(path.join(__dirname, 'public')))

//Use Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

const port = process.env.PORT || 5001;

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})

