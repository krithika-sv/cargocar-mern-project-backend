const cars = require("../models/car");
const { OpenAI } = require("openai");
const { GoogleGenerativeAI } = require("@google/generative-ai");


//add new car -admin
exports.addCarcontroller = async (req, res) => {
    console.log("Inside add car controller")
    try {
        const {
            carname,
            cardescription,
            carprice,
            carImage,
            carstatus,
        } = req.body;

        console.log(typeof carprice)

        if (typeof carprice !== "number" || carprice <= 0) {
            return res.status(400).json({ error: "carprice must be a positive number" });
        }
        else {


            const newCar = await cars.create({
                carname,
                cardescription,
                carprice,
                carImage,
                carstatus,
            });
            console.log(newCar)
            res.status(200).json(newCar);
        }
    }
    catch (err) {
        res.status(500).json({ "message": err })
    }
}

//show added cars - admin
exports.getCarsListAddedController = async (req, res) => {

    try {
        const carsavailable = await cars.find({ carstatus: "available" })
        console.log("carsavailable", carsavailable)
        res.status(200).json(carsavailable)
    } catch (err) {
        res.status(500).json({ "message": err })
    }
}

//edit added cars -admin

exports.getcareditcontroller = async (req, res) => {
    try {
        const { carname,
            cardescription,
            carprice,
            carImage,
            carstatus } = req.body

        const { id } = req.params

        const updateData = {
            carname,
            cardescription,
            carprice,
            carImage,
            carstatus
        };

        const editedcardata = await cars.findByIdAndUpdate({ _id: id }, updateData, { new: true })

        res.status(200).json({ "message": "car data edited", editedcardata })
    }
    catch (err) {
        res.status(500).json({ "message": err })
    }


}

//delete -admin
exports.deletecardatacontroller = async (req, res) => {
    console.log("delete data")

    const { id } = req.params

    const deletedata = await cars.findByIdAndDelete({ _id: id })

    res.status(200).json({ message: "Car removed successfully", data: deletedata });
}

//show availablr cars - user
exports.getCarsAvailableController = async (req, res) => {


    console.log("inside getCarsAvailableController")
    try {
        const carsavailable = await cars.find({ carstatus: "available" })
        console.log("carsavailable", carsavailable)
        res.status(200).json(carsavailable)
    } catch (err) {
        res.status(500).json({ "message": err })
    }
}

exports.getAIdataController = async (req, res) => {


    try {

        console.log("getAIdataController")
        const genAI = new GoogleGenerativeAI(process.env.geminiapi)

        const { location, duration, vehicleType } = req.body;

        console.log(location, duration, vehicleType)


        const model = genAI.getGenerativeModel({
            model: "gemini-3.6-flash"
        })

        const result = await model.generateContent(`Suggest a ${duration}-day itinerary in ${location}, 
    considering the user has rented a ${vehicleType}. Highlight nearby attractions 
    and explain why this vehicle is suitable. Keep it concise and friendly. Limit to 5 lines`)
        console.log("result", result)
        const reply = result.response
        res.status(200).json({ success: true, user: location, content: reply.candidates[0].content.parts[0].text });


    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}