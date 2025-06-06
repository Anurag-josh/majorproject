const { types } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");
//we've created only one feild ie email but passport-local-mongoose will automaticaly one more feild ie username 
const userSchema=new Schema({
    email:{
        type:String,
        required:true,
    },
});

userSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("User",userSchema);
