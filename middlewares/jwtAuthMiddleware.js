const jwt = require("jsonwebtoken");

const jwtAuthMiddleware = (req, res, next) => {
    console.log("Inside JWT Auth Middleware");

    const token = req.headers["authorization"]?.split(" ")[1];
    //small letter in code and capital letter in postman and only one space after bearer
    console.log("token", token);

    if (token) {
        try {
            const jwtResponse = jwt.verify(token, process.env.secretKey);
            console.log("jwtResponse", jwtResponse);
            req.payload = jwtResponse.usermail
            next();
        } catch (error) {
            res.status(401).json("Authorization Failed... Invalid Token!");
        }
    } else {
        res.status(500).json({ message: "Please login!.." })

    }
};

module.exports = jwtAuthMiddleware;