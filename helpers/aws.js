const aws = require('aws-sdk');
const multer = require('multer');
const multers3 = require('multer-s3');
const keys = require('../config/keys');

aws.config.update({
    accessKeyId: keys.AWSAccessKeyID,
    secretAccessKey: keys.AWSAccessKeySecret,
    region:'eu-central-1'
});

module.exports = {
    uploadImage: multer({
        storage: multers3({
            s3: new aws.S3({}),
            bucket: 'galaxyportalbucket',
            acl: 'public-read',
            metadata: (req,file,cb) => {
                cb(null,{fieldName: file.fieldName})
            },
            key: (req,file,cb) => {
                cb(null,file.originalname)
            },
            rename: (fieldName,fileName) => {
                return fileName.replace(/\w+/g,'-').toLowerCase();
            }
        })
    })
    
};

// aws.config.update({
//     accessKeyId: keys.AWSAccessKeyID,
//     secretAccessKey: keys.AWSAccessKeySecret,
//     region: 'us-east-1'
// });

// // const s3 = new aws.S3({});
// const s3 = new aws.S3();


// module.exports = {
//     uploadImage:multer({
//         storage: multerS3({
//             s3: s3,
//             bucket: 'galaxy-app',
//             acl: 'public-read',
//             metadata: (req,file,cb) => {
//                 cb(null,{fieldName: file.fieldName});
//             },
//             key: function (req, file, cb) {
//                 cb(null, Date.now().toString())
//             }
//             ,
//             rename: function (fieldName,fileName){
//                 return fileName.replace(/\w+/g,'-').toLowerCase();
//             }
//         })
//     })

// };
    
