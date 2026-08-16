const jwt = require("jsonwebtoken");

const adminMiddleware = (req, res, next) => {
    console.log("Inside JWT Auth Middleware");

    const token = req.headers["authorization"]?.split(" ")[1];
    //small letter in code and capital letter in postman and only one space after bearer
    console.log("token", token);

    if (token) {
        try {
            const jwtResponse = jwt.verify(token, process.env.secretKey);
            console.log("jwtResponse", jwtResponse);
            req.payload = jwtResponse.usermail

            if (jwtResponse.role == "admin") {
                next();
            }
            else {
                res.status(402).json("Authorization Failed... Invalid Token!");
            }
        } catch (error) {
            res.status(401).json("Authorization Failed... Token missing!");
        }
    }
};

module.exports = adminMiddleware;