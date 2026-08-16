const users = require("../models/userModel")
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

//register
exports.registerController = async (req, res) => {
    console.log("request data", req.body)

    const { username, password, email } = req.body

    const existing = await users.findOne({ email: email })

    if (existing) {
        res.status(409).json("User already exists")
    } else {

        const encryptedpassword = await bcrypt.hash(password, 10)
        // console.log("encryptedpassword", encryptedpassword)
        const newuser = await users.create({ username, email, password: encryptedpassword })
        res.status(201).json(newuser)
    }

}

//login
exports.loginController = async (req, res) => {
    console.log("request data", req.body)

    const { email, password } = req.body

    const existing = await users.findOne({ email: email })

    if (existing) {

        const isPasswordMatch = await bcrypt.compare(password, existing.password)
        console.log("isPasswordMatch", isPasswordMatch)

        if (isPasswordMatch) {

            // jwt token
            const token = jwt.sign(
                { usermail: email, role: existing.role },
                process.env.secretKey
            );
            // console.log("token", token)

            res.status(200).json({ existing, token })

        } else {
            res.status(409).json("Invalid credientials")
        }


    } else {
        res.status(400).json("Account does not exist! Please register!");
    }

}

// update user profile
exports.updateUserProfileController = async (req, res) => {
    console.log(`Inside update user profile controller`);
    console.log("body - ", req.body);
    //for image
    // console.log("file - ", req.file);

    console.log("params - ", req.params);

    console.log(req.payload)

    try {
        const { id } = req.params;
        const email = req.payload;
        const { username, phoneNumber, dateOfBirth, profileImage, drivingLicenseFrontpage, drivingLicenseBackpage } = req.body;

        // const { uploadImage } = req.file.filename;

        // const uploadImage = req.file ? req.file.filename : profileImage;

        const uploadImage = req.files["profileImage"] ? req.files["profileImage"]?.[0].path : profileImage;
        const licenseFront = req.files["drivingLicenseFrontpage"] ? req.files["drivingLicenseFrontpage"]?.[0].path : drivingLicenseFrontpage;
        const licenseBack = req.files["drivingLicenseBackpage"] ? req.files["drivingLicenseBackpage"]?.[0].path : drivingLicenseBackpage;

        console

        // new method
        const updateUser = await users.findByIdAndUpdate(
            { _id: id },
            { username, phoneNumber, dateOfBirth, profileImage: uploadImage, drivingLicenseFrontpage: licenseFront, 
                drivingLicenseBackpage: licenseBack },

            { new: true } // to tell the mongo db it is the new one
        );

        res.status(200).json(updateUser);
    } catch (err) {
        res.status(400).json({ message: "Something went wrong", error: err.message });
    }



};

