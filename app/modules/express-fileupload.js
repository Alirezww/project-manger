const path = require('path');
const { createUploadPath } = require('./functions');

const uploadFile = async(req, res, next) => {
    try {
        let image = req.files.image
        let type = path.extname(image.name);
        const image_path =  path.join(createUploadPath(), (Date.now() + type))

        req.body.image = image_path.substring(7)
        let uploadPath = path.join(__dirname, "..", "..", image_path);

        image.mv(uploadPath, (err) => {
            if(err) throw {status : 500, message : "بارگذاری تصویر انجام نشد"}
            next();
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    uploadFile
}