const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const bcrypt = require('bcryptjs');
const formidable = require('formidable');
// load models
const Message = require('./models/message.js');
const User = require('./models/user');
const app = express();
//load keys file
const keys = require('./config/keys.js');
//load helpers
const {requireLogin,ensureGuest} = require('./helpers/auth');
const {uploadImage} = require('./helpers/aws');
// use body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
//configuration for authentication
app.use(cookieParser());
app.use(session({
    secret: 'mysecret',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function(req,res,next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});
//setup express static folder to serve js, css files
app.use(express.static('public'));
//make user glober object
app.use(function(req,res,next){
    res.locals.user = req.user || null;
    next();
});
//load facebook strategy
// require('./passport/facebook');
// require('./passport/google');
require('./passport/local');
// connect to mlab mongodb
mongoose.connect(keys.MongoDB, {useNewUrlParser:true, useUnifiedTopology: true}).then(function(){
    console.log('Server is connected to MongoDB');    
}).catch(function(err){
    console.log(err);    
});

// environment variable for port
// const port = process.env.PORT || 3000;
// setup view engine
app.engine('handlebars',exphbs({defaultLayout:'main'}));
app.set('view engine','handlebars');


app.get('/',ensureGuest,function(req,res){
    res.render('home',{
        title:'Home'
    });
});

app.get('/about',ensureGuest,function(req,res){
    res.render('about',{
        title:'About'
    });
});

app.get('/contact',ensureGuest,function(req,res){
    res.render('contact',{
        title:'Contact'
    });
});

// app.get('/auth/facebook',passport.authenticate('facebook',{
//     scope: ['email']
// }));
// app.get('/auth/facebook/callback',passport.authenticate('facebook',{
//     successRedirect: '/profile',
//     failureRedirect:'/'
// }));

// app.get('/auth/google',passport.authenticate('google',{
//     scope: ['profile']
// }));
// app.get('/auth/google/callback',passport.authenticate('google',{
//     successRedirect: '/profile',
//     failureRedirect: '/'
// }));

app.get('/profile',requireLogin,function(req,res){
    User.findById({_id:req.user._id}).then(function(user){
        if (user){
            user.online= true;
            user.save(function(err,user){
                if (err){
                    throw err;
                } else{
                    res.render('profile',{
                        title: 'profile',
                        user:user
                    });
                }
            })
        }
    });
});

app.get('/newAccount', function(req,res){
    res.render('newAccount',{
        title: 'Signup'
    });
});

app.post('/signup',function(req,res){
    console.log(req.body); 
    let errors = [];
    
    if (req.body.password !== req.body.password2){
        errors.push({text: 'Password does Not match'});
    }
    if (req.body.password.length < 5){
        errors.push({text: 'Password must beatleast 5 characters'});
    }
    if (errors.length > 0){
        res.render('newAccount',{
            errors: errors,
            title: 'Error',
            fullname: req.body.username,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        });
    }else{
        User.findOne({email:req.body.email})
        .then(function(user){
            if (user) {
                let errors = [];
                errors.push({text:'Email already exist'});
                res.render('newAccount',{
                    title: 'Signup',
                    errors:errors
                })
            }else{
                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(req.body.password, salt);
                const newUser = {
                    fullname: req.body.username,
                    email: req.body.email,
                    birthDate: req.body.birthDate,
                    address: req.body.address,
                    gender: req.body.gender,
                    occupation: req.body.occupation,
                    parentsAddress: req.body.parentsAddress,
                    city: req.body.city,
                    country: req.body.country,
                    parentsFullname: req.body.parentsFullname,
                    phoneNumber: req.body.phoneNumber,
                    // studentAmage:req.body.studentAmage,
                    password: hash
                }
                // console.log(newUser);  
                new User(newUser).save(function(err, user){
                    if (err){
                        throw err;
                    }
                    if (user){
                        let success = [];
                        success.push({text: 'You have successfully created an account, you can login now'});
                        res.render('home',{
                            success: success
                        });
                    }
                })             
            }
        });
    }


});

app.post('/login',passport.authenticate('local',{
    successRedirect:'/profile',
    failureRedirect:'/loginErrors'
}));
app.get('/loginErrors',function(req,res){
    let errors = [];
    errors.push({text:'User Not Found or Password is Incorrect'});
    res.render('home',{
        errors:errors
    });
});
// handle get route
app.get('/uploadImage',function(req,res){
    res.render('uploadImage',{
      title: 'Upload'
    });
  });
  app.post('/uploadAvatar', function(req,res){
    User.findById({_id:req.user._id})
    .then(function(user){
    //   user.image = req.body.upload;
      user.image = `https://galaxyportalbucket.s3.eu-central-1.amazonaws.com/${req.body.upload}`;
      user.save(function(err){
        if (err) {
          throw err;
        }
        else{
          res.redirect('/profile');
        }
      });
    });
  });
  app.post('/uploadFile',uploadImage.any(),function(req,res){
    const form = new formidable.IncomingForm();
    form.on('file',function(field,file){
        console.log(file);
    });
    form.on('error', function(err){
        console.log(err);
    });
    form.on('end',function(){
        console.log('Image upload is successfull ..');
    });
    form.parse(req);
  });

app.get('/logout', function(req,res){
    User.findById({_id:req.user._id})
    .then(function(user){
        user.online= false;
        user.save(function(err,user){
            if (err){
                throw err;
            }
            if (user){
                req.logout();
                res.redirect('/');
            }
        })
    })
   
})

app.post('/contactUs',function(req,res){
    console.log(req.body);
    //res.send('thanks');
    const newMessage = {
        fullname: req.body.fullname,
        email: req.body.email,
        message: req.body.message,
        date: new Date()
    }
    

    new Message(newMessage).save(function(err, message){
        if (err){
            throw err;
        }else{
            Message.find({})
            .then(function(messages){
                if(messages){                    
                    res.render('newmessage',{
                        title: 'Sent',
                        messages:messages
                    });
                }else{
                    res.render('noMessage',{
                        title: 'Not found'
                    });
                }
            });
        }
        
    });
    
});




app.listen(process.env.PORT || 3000, function() {
    console.log('Server is running on Port 3000');
});