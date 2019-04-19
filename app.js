const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.get('/',(req,res)=>{
    res.send("Yup It Works")
})

const port = process.env.port || 5001;

app.listen(port,()=>{
    console.log(`Server started on port ${port}`)
})

