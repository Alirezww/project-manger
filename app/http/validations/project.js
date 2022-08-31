const { body } = require("express-validator");
const path = require("path");

 function createProjectValidator(){
    return [
        body("title")
            .notEmpty()
            .withMessage("عنوان پروژه نمی تواند خالی باشد."),

        body('text')
            .notEmpty()
            .isLength({ min : 25 })
            .withMessage("توضیحات پروژه نمیتواند خالی باشد و حداقل باید 25 کاراکتر باشد."),

        body('tags')
            .isArray({ min : 0, max:30 })
            .withMessage("هشتگ های پرورژه نباید بیشتر از 30 تا باشد."),

        body('image')
            .custom(async(value,{ req }) => {
                if(!req.files) throw "تصویر شاخص پروژه را ارسال نمایید";
 
                let image = req.files.image
                let type = path.extname(image.name);
                if(![".png", ".jpg", ".jpeg", ".webp", ".gif"].includes(type)) "فرمت ارسال شده ی تصویر صحیح نمیباشد";

                return true

            })
    ]
 }

 module.exports = {
    createProjectValidator
 }