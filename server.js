//jshint esversion: 6

const express = require('express');
const exhandlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
// setup views engine
app.engine('handlebars', exhandlebars({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({extended: true}));

app.get('/',function(req,res){
    res.render('home',{
        title:'Home'
    });
});

app.get('/about',function(req,res){
    res.render('about',{
        title:'About'
    });
});

app.get('/contact',function(req,res){
    res.render('contact',{
        title:'Contact'
    });
});

app.listen(process.env.PORT || 3000, function() {
    console.log('Server is running on Port 3000');
});
