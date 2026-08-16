
//import mongoose
const mongoose = require("mongoose")

//define schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
        default: ""
    },
    role: {
        type: String,
        default: "user"
    },
    phoneNumber: {
        type: String,
        default: ""
    },
    dateOfBirth: {
        type: String,
        default: ""
    },
    drivingLicenseFrontpage: {
        type: String,
        default: ""
    },
    drivingLicenseBackpage: {
        type: String,
        default: ""
    }
})

//create model
const users = mongoose.model("users", userSchema)

//export
module.exports = users
