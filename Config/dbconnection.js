const mongoose = require("mongoose")
const Dbconnectionstring = process.env.mongodbconnectionstring

mongoose.connect(Dbconnectionstring).then(res => {
    console.log("MongoDB connected successfully")
}).catch(err => {
    console.log("MongoDB connected failed")
    console.log(err)

})