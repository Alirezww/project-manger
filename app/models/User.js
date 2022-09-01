const mongoose = require("mongoose");

const InviteRequest = new mongoose.Schema({
    teamID : {type : mongoose.Types.ObjectId, required : true},
    caller : { type : String, required : true , trim : true},
    reuestDate : { type : Date, default : new Date() },
    status : { type : String, default : "pending"} // Pending - accepted - rejected
})

const UserSchema = new mongoose.Schema({
    first_name : {type : String , trim : true},
    last_name : {type : String, trim : true},
    username : {type : String , required : true, unique : true, trim : true},
    mobile : {type : String , required : true, unique : true},
    roles : {type : [String] , default : ["USER"]},
    email : {type : String , required : true, unique : true, trim : true},
    password : {type : String , required : true},
    skills : {type : [String] , default : []},
    teams : {type : [mongoose.Types.ObjectId] , default : []},
    token : { type : String, default : '' },
    profile_image : { type : String, default : '' },
    inviteRequests : { type : [InviteRequest]}
} , {timestamps : true }
)

const UserModel = mongoose.model("User" , UserSchema);

module.exports = {
    UserModel
};