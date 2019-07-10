const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport')

//Passport config
require('./config/passport')(passport)

const app = express();

app.get('/',(req,res)=>{
    res.send("Yup It Works")
})

//Use Routes
app.use('/auth',require('./routes/auth'))

const port = process.env.PORT || 5001;

app.listen(port,()=>{
    console.log(`Server started on port ${port}`)
})

