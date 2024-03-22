
const express = require('express');
const app = express();
require('./src/db/conn')
const path = require('path');
const middleware = require('./middleware');
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '--' + file.originalname)
    }
})

const upload = multer({ storage: storage });


const hbs = require('hbs');
const async = require('async')
const Register = require("./src/models/register");
const user = require("./src/models/charcter");
const { dirname } = require('path');
const { exec } = require('child_process');

// image path
// limit: 5mb
// filter : png, jpeg,jpg


const port = process.env.PORT || 4000;

const static_path = path.join(__dirname, "./");
const templates_path = path.join(__dirname, "./templates/views");
const Partials_path = path.join(__dirname, "templates/partials");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", templates_path);
hbs.registerPartials(Partials_path);


app.get("/", (req, res) => {
    res.render("login.hbs");
});
app.get("/registration", (req, res) => {
    res.render("registration.hbs");
});
app.get("/forget", (req, res) => {
    res.render("forget.hbs");
});
app.get("/table", (req, res) => {
    //    console.log(req.query.,"hgyjgcjdgkfhdhbk");
    res.render("table.hbs");
});
app.get("/newpassword", (req, res) => {
    res.render("newpassword.hbs");
});
app.get("/singledata", (req, res) => {
    res.render("singledata.hbs");
});
app.get("/update", (req, res) => {
    res.render("update.hbs");
});
app.get("/delete", (req, res) => {
    res.render("delete.hbs");
});
app.get("/update1", (req, res) => {
    res.render("update1.hbs");
});
app.post("/registration", upload.single('image'), async (req, res) => {
    // console.log(req.body , 2222);
    try {
        Register.findOne({ email: req.body.email }, async (err, r) => {
            if (err) {
                res.send({ success: false });
            } else {
                if (r) {
                    res.send({ success: false, massage: "email already exist" });
                } else {
                    const registerEmployee = new Register({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password,
                        dob: req.body.dob,
                        mobile: req.body.mobile,
                        image: req.file.filename,
                        userType: req.body.userType
                    })
                    const registered = await registerEmployee.save();
                    res.status(201).render("login.hbs");
                }
            }
        })
    } catch (error) {
        res.status(400).send(error);
    }
});

app.post("/login", async (req, res) => {
    try {
        Register.findOne({ email: req.body.email }, (err, r) => {
            if (err) {
                res.send({ success: false });
            } else {
                if (r) {
                    if (r.password != req.body.password) {
                        res.send({ success: false, message: "incorrect password" });
                    } else if (r.block == true) {
                        res.send({ success: false, message: "user is block" })
                    }
                    else {
                        res.send({ success: true, message: r });
                    }
                } else {
                    res.send({ success: false, message: "User doesn't found!!" });
                }
            }
        });
    } catch (e) {
        res.send(e);
    }
});

app.post("/forget", async (req, res) => {
    try {
        Register.findOne({ email: req.body.email }, async (err, r) => {
            if (err) {
                res.send({ success: false });
            } else {
                if (r) {
                    if (req.body.password == req.body.confirmPassword) {
                        Register.findOneAndUpdate({ email: req.body.email }, { $set: { password: req.body.password } }, async (err1, re) => {
                            if (err1) {
                                res.send({ success: false });
                            }
                            else {
                                res.status(201).render("login")
                            }
                        })
                    } else {
                        res.send({ success: false, message: "Password doesn't match with confirm password " })
                    }
                }
            }
        })
    } catch (e) {
        res.send(e);
    }
});

app.post("/getData", (req, res) => {
    try {
        Register.find({}, (err2, r2) => {

            if (err2) {
                res.send({ success: false, message: err2 });
            } else {
                //   console.log(r2);
                res.send({ success: true, data: r2 })
            }
        })

    } catch (err2) {
        res.send({ success: false, message: err2 });
    }
})

app.post("/newpassword", async (req, res) => {
    try {
        Register.findOne({ email: req.body.email }, (er, result) => {
            if (er) {

                res.send({ success: false });
            } else {
                if (result) {
                    // console.log(result, "9787878787878");
                    if (req.body.oldPassword != req.body.newPassword && req.body.oldPassword == result.password) {
                        Register.findOneAndUpdate({ email: req.body.email }, { $set: { password: req.body.newPassword } }, (err, r) => {
                            if (err) {
                                res.send({ success: false });

                            } else {
                                res.status(201).render("table");
                            }
                        })
                    } else {
                        res.send({ success: false, message: "Password doesn't change " });
                    }
                } else {
                    res.send({ success: false, message: "user are not fuond" });
                }
            }
        })
    } catch (e) {
        res.send(e);
    }
});

app.post("/singledata", async (req, res) => {
    try {
        var email1 = JSON.parse(req.body.email);
        Register.findOne({ email: email1 }, async (err, re) => {
            // console.log(req, "333333333333333333");
            if (err) {
                res.send({ success: false });
            } else {
                res.send({ success: true, data: re })
            }
        })
    } catch (e) {
        res.send(e);
    }

})

app.post("/delete", async (req, res) => {
    try {
        var userid1 = req.body.id;
        Register.findOneAndDelete({ _id: userid1 }, async (e, r) => {
            //console.log(userid1,"999999999999999999999999");
            if (e) {
                res.send({ success: false });
            } else {
                res.send({ success: true, message: "user deleted" });
                // console.log(r)
            }
        });
    } catch (e) {
        res.send(e);
    }
});

////////edit data////////
app.post("/updateData", (req, res) => {
    // console.log(res, "3333333333333333")
    try {
        var id = req.body._id;
        //console.log(id, "555555555")
        Register.findOne({ _id: id }, function (e, r) {
            if (e) {
                res.send({ success: false });
            }
            else {
                console.log(r);
                res.send({ success: true, eData: r });
            }
        });
    } catch (e) {
        res.send(e);
    }
});

/////// update and render table ////////
app.post("/update", (req, res) => {
    //console.log(req.body,"---------")
    try {
        var id = req.body._id;
        Register.findOneAndUpdate({ _id: id }, {
            $set: {
                name: req.body.name,
                email: req.body.email,
                mobile: req.body.mobile,
                password: req.body.password,
                dob: req.body.dob
            }
        }, (e, r) => {
            if (e) {
                res.send({ success: false });
            } else {
                // console.log(r,"00000000000000000"),
                res.send({ success: true });
            }

        })
    } catch (e) {
        res.send(e);
    }
});

/////block api /////
app.post("/blockuser", async (req, res) => {
    try {
        var id = req.body.block_id;
        var block = req.body.block;
        Register.findOneAndUpdate({ _id: id }, {
            $set: { block: block }
        }, (e, r) => {
            if (e) {
                res.send({ success: false })
            } else {
                res.send({ success: true, message: "user are blocked" })
            }
        })
    } catch (e) {
        res.send(e);
    }
})

app.post("/unblockuser", async (req, res) => {
    try {
        var id = req.body.unblock_id;
        var block = req.body.blocked;
        Register.findOneAndUpdate({ _id: id }, {
            $set: { block: block }
        }, (e, r) => {
            if (e) {
                res.send({ success: false })
            } else {
                res.send({ success: true, message: "user are unblocked" });
            }
        })
    } catch (e) {
        res.send(e);
    }
})
//////userData////////
// app.post("/userData", (req, res) => {
//     try{
//     var newuser = new user();
//     newuser.userId = req.body.userId
//     newuser.hobby = req.body.hobby
//     newuser.address = req.body.address

//     newuser.save((e, r) => {
//         if(e){
//             res.send({success: false});
//         } else {
//            res.send({success: true, data: r})
//         }
//     })
//     } catch (e){
//         res.send(e)
//     }
// })


////////populate/////////
// app.post("/populate", (req, res) =>{
//     try{
//         user.findOne({id: req.body.id})
//         .populate('userId')
//         .exec((ee, re) =>{
//             if(ee){
//                 res.send({success: false});
//             }else{
//                 res.send({success: true, data: re})
//             }
//         })
//     } catch(ee){
//         res.send(ee);
//     } 
// })



// app.post("/paralleldata", async (req, res) =>{
//     async.parallel({
//         register: function(cb){
//             Register.findOne({ _id: req.body.id }).exec(cb)
//         },
//         user: function(cb){
//             user.find({ _id: req.body.userId }, (e, r) =>{
//                 if(e){ 
//                     cb(null)
//                 }
//                 else
//                 {
//                     cb(null, r)
//                 }
//             })
//         },
//     } ,function(er, re) {
//             if(er) {
//                 res.send({success: false});
//             } else {
//                 res.send({success: true, data: re});
//             }
//     })
// })

// app.post("/waterfall", async (req, res) => {
//     async.waterfall([
//         function (cb) {
//             Register.findOne({ _id: req.body.id1 }, (e, r) => {
//                 if (e) {
//                     cb(null)
//                 }
//                 else {
//                     cb(null, r)
//                 }
//             }),
//                 function (cb) {
//                     user.find({ _id: req.body.userId }, (e, r) => {
//                         if (e) {
//                             cb(null)
//                         }
//                         else {
//                             cb(null, r)
//                         }
//                     })
//                 }
//         } 
//     ],function (er, result) {
//       console.log(result, "5444444444444")
//         if (er) {
//             res.send({ success: false });
//         }
//         else {
//             res.send({ success: true, data: result })
//         }
//     })
// })

// app.post("/each", async (req, res) =>{
//     var data = await Register.find({},{name:1,email:1,_id:1}).sort({name: 1}).limit(4).exec();
//     let array = []
//     async.each(data,(q, cb) =>{
//       //  console.log(q.name,"5654545454545")

//         array.push(q);
//    cb(null)
// }, function(ee, rr) {
//     if(ee) {
//         res.send({success: false});
//     }else{
//        res.send({success: true, Data: array});
//     }
// })
// })

// app.post("/eachSeries", async (req, res) => {
//     var data = await Register.find({}, { name: 1, email: 1, _id: 1 }).exec();
//     let array = []
//     async.each(data, (q, cb) => {
//         console.log(q, "5654545454545")
//         array.push(q);
//         cb(null)
//     }, function (ee, rr) {
//         if (ee) {
//             res.send({ success: false });
//         } else {
//             res.send({ success: true, Data: array });
//         }
//     })
// })


// app.post("/eachOf", async (req, res) => {
//     console.log(req.body, "88888888888")
//     var data = await Register.find({}).limit(4).exec();
//     let dataArray = [];
//     async.eachOf(data, (a, b, cb) => {
//         // console.log(a, b)
//         var getData = {
//             name: a.name,
//             email: a.email,
//             id: a.id
//         }
//         dataArray.push(getData);
//         cb(null);
//     }, function (ee, result) {
//         if (ee) {
//             console.log(ee, '2222222')
//             res.send({ success: false });
//         } else {
//             console.log(dataArray, "111111111111")
//             res.send({ success: true, data: dataArray })
//         }
//     })   
// })

// app.post("/eachOfSeries", async (req, res) =>{
//     var data = await Register.find({}, {name: 1, email: 1, _id: 1}).exec();
//     let array = [];
//     async.eachOfSeries(data, (x, y, cb) =>{
//         console.log(y, "88888888888")
//         array.push(x);
//         cb(null);
//     }, function(ee, rr){
//         if(ee){
//             res.send({success: false});
//         }else{
//             console.log(rr, '11111111111')
//             res.send({success: true, Data: array})
//         }
//     })
// })


app.listen(port, () => {
    console.log("serve is running is port no 4000");
})