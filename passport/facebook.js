// const passport = require('passport');
// const facebookStrategy = require('passport-facebook').Strategy;
// const User = require('../models/user');
// const keys = require('../config/keys');

// passport.serializeUser(function(user,done){
//   done(null,user.id);
// });

// passport.deserializeUser(function(id,done){
//   User.findById(id,function(err,user){
//     done(err,user);
//   });
// });

// passport.use(new facebookStrategy({
//     clientID: keys.FacebookAppID,
//     clientSecret:keys.FacebookAppSecrete,
//     callbackURL: 'https://still-stream-04953.herokuapp.com/Auth/facebook/callback',
//     profileFields: ['email','name','displayName','photos']

// },function(accessToken, refreshToken, profile, done){
//     console.log(profile);
//     User.findOne({facebook:profile.id},function(err,user){
//         if(err){
//             return done(err);
//         }
//         if(user){
//             return done(null,user);
//         }else{
//             const newUser= {
//                 facebook: profile.id,
//                 fullname: profile.displayName,
//                 lastname: profile.name.familyName,
//                 firstname: profile.name.givenName,
//                 image: `https://graph.facebook.com/${profile.id}/picture?type=large`,
//                 email: profile.emails[0].value
//             }
//             new User(newUser).save(function(err,user){
//                 if (err){
//                     return done(err);
//                 }
//                 if(user){
//                     return done(null,user);
//                 }
//             });
//         }
//     });    
// }));