const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcryptjs');

passport.serializeUser(function(user,done){
    done(null,user.id);
});

passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        done(err,user);
    });
});

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},function(email,password,done){
    User.findOne({email:email})
    .then(function(user){
        if(!user){
            return done(null,false);
        }
        bcrypt.compare(password,user.password,function(err,isMatch){
            if(err){
                throw err;
            }
            if(isMatch){
              return done(null,user);
            }
            else{
                return done(null,false);
            }
        })
    }).catch(function(err){
        console.log(err);
        
    });
}));