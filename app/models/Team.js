const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema({
    name : {type : String,  required : true},
    description : {type : String},
    users : {type : [mongoose.Types.ObjectId], default : []},
    leader : {type : mongoose.Types.ObjectId, required : true}
} , {timestamps : true }
)

const TeamModel = mongoose.model("Team" , TeamSchema);

module.exports = {
    TeamModel
};