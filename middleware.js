const express = require("express")
const app = express()
const Register = require('./src/models/register') 

module.exports = middleware = (req, res, next) => {
    Register.findOne({_id: req.query.userId}, async (e, r) => {
       // console.log(req.query.userId, "0000000000000");
        if(e){
            res.send({success: false, message: "plz-login first"})
        } else {
            if(r){
                next()
            }else{
                res.send({success: false, message: "plz-login first"})
            }
        }
        })

        }

















        
 //  async.parrallel({
//     registerData : function(cb) {
//         Register.findOne(lkjjl, function(er, re) {
//             if(er) cb(null);
//             else cb(null, re)
//         })
//     },
//     userData : function(cb) {
//         User.findOne(lkjjl, function(er, re) {
//             if(er) cb(null);
//             else cb(null, re)
//         })
//     },
// }, function(er, re) {
//     if(er) {
//         res
//     } else {
//         console.log(re.registerData)
//     }
// })