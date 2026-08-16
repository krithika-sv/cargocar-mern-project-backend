const multer = require("multer");

// define storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, "./uploads");
    },
    filename: (req, file, callBack) => {
        callBack(null, `Image-${Date.now()} - ${file.originalname}`);
    }
});

// fileFilter
const fileFilter = (req, file, callBack) => {
    if (file.mimetype.startsWith("image/")) {
        callBack(null, true);
    } else {
        callBack(null, false);
    }
};

const multerMiddleware = multer({
    storage,
    fileFilter
});

module.exports = multerMiddleware;
