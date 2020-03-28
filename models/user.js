const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    facebook:{
        type: String
    },
    google: {
        type: String
    },
    firstname:{
        type: String
    },
    lastname:{
        type: String
    },
    fullname:{
        type: String
    },
    image:{
        type: String,
        default: '/images/user-logo.jpg'
    },
    image2:{
        type: String,
        default: '/images/user-logo.jpg'
    },

    parentsFullname:{
        type: String
    },
    occupation:{
        type: String
    },
    parentsAddress:{
        type: String
    },
    phoneNumber: {
         type: String
    },
    birthDate:{
        type: String
    },
    gender:{
        type: String
    },
    address:{
        type: String
    },
    email:{
        type: String
    },
    city:{
        type: String
    },
    country:{
        type: String
    },
    online:{
        type:Boolean,
        default: false
    },
    wallet:{
        type: Number,
        default: 0
    },
    password: {
        type: String
    }
});

module.exports = mongoose.model('user',userSchema);