 const mongoose = require('mongoose');

 const hobbySchema = new mongoose.Schema({
     userId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Registration",
     },
     hobby: {
        type: String,
     },
     address: {
        type: String,
     }
 });
 module.exports=mongoose.model("Hobby", hobbySchema)