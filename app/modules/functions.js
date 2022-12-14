const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const fs = require("fs");
const path = require("path");

function createUploadPath(){
    let d = new Date();
    const Year = ""+d.getFullYear();
    const Month = d.getMonth() + "";
    const day = "" + d.getDate();
    const uploadPath = path.join(__dirname, "..", "..", "public", "upload", Year, Month, day);
    fs.mkdirSync(uploadPath, {recursive : true});
    return path.join("public", "upload", Year, Month, day);
}

function generateImageLink(imagePath, req){
    return (req.protocol + "://" + req.get("host") + "/" + (imagePath.replace(/[\\\\]/gm, "/")))
}

const hashString = (str) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(str, salt)
};

function tokenGenerator (payload){
    const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn : "3 days" } );
    return token;
}

function jwtTokenVerify (token) {
    const result = jwt.verify(token, process.env.SECRET_KEY);
    if(!result?.username) throw {status : 401, message : 'لطفا وارد حساب کاربری خود شوید.'}
    return result
}

module.exports = {
    hashString,
    tokenGenerator,
    jwtTokenVerify,
    createUploadPath,
    generateImageLink
}