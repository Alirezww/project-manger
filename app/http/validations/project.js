const { body } = require("express-validator")

 function createProjectValidator(){
    return [
        body("title")
            .notEmpty()
            .withMessage("عنوان پروژه نمی تواند خالی باشد."),

        body('text')
            .notEmpty()
            .isLength({ min : 25 })
            .withMessage("توضیحات پروژه نمیتواند خالی باشد و حداقل باید 25 کاراکتر باشد.")
    ]
 }

 module.exports = {
    createProjectValidator
 }