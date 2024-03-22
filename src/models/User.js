const mongoose = require('mongoose');

const loginemployeeSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});
const Login = new mongoose.model("Registration", loginemployeeSchema)
module.exports = Login;