
//import mongoose
const mongoose = require("mongoose")

//define schema
const carSchema = new mongoose.Schema({
    carname: {
        type: String,
        required: true
    },
    cardescription: {
        type: String,
        required: true
    },
    carprice: {
        type: Number,
        required: true
    },
    carImage: {
        type: String,
        default: ""
    },
    carstatus: {
        type: String,
        default: ""
    }
})

//create model
const cars = mongoose.model("cars", carSchema)

//export
module.exports = cars
