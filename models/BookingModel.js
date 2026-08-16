
//import mongoose
const mongoose = require("mongoose")

//define schema
const bookingSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    pickuplocation: {
        type: String,
        required: true
    },
    dropofflocation: {
        type: String,
        required: true
    },
    startdate: {
        type: String,
        required: true
    },
    enddate: {
        type: String,
        required: true
    },
    startime: {
        type: String,
        required: true
    },
    endtime: {
        type: String,
        required: true
    },
    carname: {
        type: String,
        default: ""
    },
    cardescription: {
        type: String,
        default: ""
    },
    carprice: {
        type: Number,
        default: ""
    },
    carImage: {
        type: String,
        default: ""
    },
    carstatus: {
        type: String,
        default: ""
    },
    username: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        default: ""
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
    },
    bookingstatus: {
        type: String,
        default: ""
    },

    payment: {
        type: String,
        default: "Not Completed"
    }

})

//create model
const booking = mongoose.model("booking", bookingSchema)

//export
module.exports = booking
