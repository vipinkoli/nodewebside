const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    dob: {
        type: String,
        required: true,
    },
    mobile: {
        type: Number,
        required: true,
        unique: true,
    },
    
    image: {
        type: String ,
        required: true, 
    },
    isLogin:{
        type: Boolean,
        default: false,
    },
    userType: {
        type: String,
      require: true,
    },
    block: {
        type: "Boolean",
       default: false,
    },
});
const Registration = new mongoose.model("Registration", employeeSchema)
module.exports = Registration;