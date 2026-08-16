const Razorpay = require("razorpay");
const booking = require("../models/BookingModel");
const cars = require("../models/car");
const users = require("../models/userModel");

//booking car by user
exports.bookCarController = async (req, res) => {
    console.log("Inside book car controller")
    // console.log("body - ", req.body);

    try {
        const {
            pickuplocation,
            dropofflocation,
            startdate,
            enddate,
            startime,
            endtime
        } = req.body;

        const email = req.payload

        const { id } = req.params

        console.log("userId", email)

        console.log("carId", id)

        //logic check car is present in car model and check availability

        const isUserExists = await users.findOne({ email })
        console.log("isUserExists", isUserExists)
        if (isUserExists) {
            console.log("isUserExists", isUserExists)
            if (!isUserExists.phoneNumber || !isUserExists.dateOfBirth || !isUserExists.drivingLicenseFrontpage || !isUserExists.drivingLicenseBackpage) {
                res.status(200).json({ message: "Please fill all details in the profile" })
            } else {
                const iscaravailable = await cars.findOne({ _id: id, carstatus: "available" })
                console.log("iscaravailable", iscaravailable)
                if (iscaravailable) {
                    const newcarbooking = await booking.create({
                        email,
                        pickuplocation,
                        dropofflocation,
                        startdate,
                        enddate,
                        startime,
                        endtime,
                        carname: iscaravailable.carname,
                        cardescription: iscaravailable.cardescription,
                        carprice: iscaravailable.carprice,
                        carImage: iscaravailable.carImage,
                        carstatus: "booked",
                        username: isUserExists.username,
                        email: isUserExists.email,
                        phoneNumber: isUserExists.phoneNumber,
                        dateOfBirth: isUserExists.dateOfBirth,
                        drivingLicenseFrontpage: isUserExists.drivingLicenseFrontpage,
                        drivingLicenseBackpage: isUserExists.drivingLicenseBackpage,
                    })
                    console.log("newcarbooking", newcarbooking)



                    res.status(200).json(newcarbooking);

                    // update car status in cars model
                    await cars.findByIdAndUpdate(
                        { _id: id },
                        { carstatus: "booked" }
                    );
                } else {
                    res.status(200).json("Car unavailable")
                }
            }


        } else {
            res.status(200).json({ message: "Please Login to proceed" })
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

//get booked cars - admin

exports.getbookedcarsController = async (req, res) => {

    console.log("getbookedcarsControllers")

    const bookedcars = await booking.find({ carstatus: "booked" })

    console.log("booked cars", bookedcars)

    res.status(200).json(bookedcars)

}


//get single car with is - user

exports.getsinglecarcontroller = async (req, res) => {

    try {
        const { id } = req.params

        const cardata = await booking.find({ _id: id })

        res.status(200).json(cardata)

    } catch (err) {

        res.status(500).json(err)
    }


}

//update booking status - admin

exports.updatebookingstatuscontroller = async (req, res) => {
    try {
        const { id } = req.params

        const { bookingstatus } = req.body

        const updatedcarstatusdata = await booking.findByIdAndUpdate({ _id: id }, { bookingstatus }, { new: true })

        console.log("updatedcarstatusdata", updatedcarstatusdata)

        res.status(200).json(updatedcarstatusdata)
    }

    catch (err) {
        res.status(500).json(err)
    }

}

//get booking data - user

exports.getuserbookingdata = async (req, res) => {

    try {
        const email = req.payload

        const bookinglist = await booking.find({ email })
        res.status(200).json(bookinglist)
    }
    catch (err) { res.status(200).json(err) }
}


//razorpay integration

exports.getRazorpayController = async (req, res) => {
    try {
        const {
            amount
        } = req.body

        const { id } = req.params

        const bookingpresent = await booking.findById({ _id: id })



        if (bookingpresent) {

            bookingpresent.payment = "Completed"

            const razorpay = new Razorpay({
                // key_id: process.env.key_id,
                // key_secret: process.env.key_secret,

                key_id: process.env.RAZORPAY_KEYID,
                key_secret: process.env.RAZORPAY_KEYSECRET,
            });

            console.log("amount", amount, razorpay)

            const order = await razorpay.orders.create({
                amount: amount, // 500 INR
                currency: "INR",
            });

            console.log("order", order)

            await bookingpresent.save()
            res.status(200).json(order);

        } else {
            res.status(500).json("Booking not available");
        }


    }
    catch (err) {
        res.status(500).json(err);
    }

}


//dashboard data

exports.getdashboarddataController = async (req, res) => {
    try {
        const result = await booking.aggregate([
            {
                $group: {
                    _id: null,
                    totalCarPrice: { $sum: "$carprice" },
                    totalBookings: { $sum: 1 },
                    cancelledBookings: {
                        $sum: {
                            $cond: [{ $eq: ["$bookingstatus", "cancelled"] }, 1, 0]
                        }
                    },
                    completedBookings: {
                        $sum: { $cond: [{ $eq: ["$bookingstatus", "completed"] }, 1, 0] }
                    },
                    ongoingBookings: {
                        $sum: { $cond: [{ $eq: ["$bookingstatus", "ongoing"] }, 1, 0] }
                    },
                    upcomingBookings: {
                        $sum: { $cond: [{ $eq: ["$bookingstatus", "upcoming"] }, 1, 0] }
                    }
                }
            }
        ]);

        const stats = result[0] || {};

        // Build separate object array
        const statusArray = [
            { name: "Ongoing", value: stats.ongoingBookings || 0 },
            { name: "Upcoming", value: stats.upcomingBookings || 0 },
            { name: "Completed", value: stats.completedBookings || 0 },
            { name: "Cancelled", value: stats.cancelledBookings || 0 }
        ];

        res.status(200).json({
            totalCarPrice: result[0]?.totalCarPrice || 0,
            totalBookings: result[0]?.totalBookings || 0,
            cancelledBookings: result[0]?.cancelledBookings || 0,
            statusBreakdown: statusArray
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
}

//chart data

exports.getchartdata = async (req, res) => {
    try {

        // Car price dataset
        const carData = [
            { model: "Hatchback", price: 1200 },
            { model: "Sedan", price: 1800 },
            { model: "SUV", price: 2500 },
            { model: "Luxury Sedan", price: 4500 },
            { model: "Compact SUV", price: 2200 },
            { model: "Convertible", price: 5000 },
            { model: "Pickup Truck", price: 3000 },
            { model: "Electric Hatchback", price: 2800 },
            { model: "Hybrid Sedan", price: 3500 },
            { model: "Minivan", price: 2700 }
        ];

        // Fleet utilization dataset
        const fleetData = [
            { category: "Hatchback", reserved: 30, idle: 20 },
            { category: "Sedan", reserved: 25, idle: 15 },
            { category: "SUV", reserved: 40, idle: 10 },
            { category: "Luxury Sedan", reserved: 18, idle: 7 },
            { category: "Compact SUV", reserved: 22, idle: 12 },
            { category: "Convertible", reserved: 8, idle: 4 },
            { category: "Pickup Truck", reserved: 15, idle: 5 },
            { category: "Electric Hatchback", reserved: 12, idle: 6 },
            { category: "Hybrid Sedan", reserved: 10, idle: 3 },
            { category: "Minivan", reserved: 20, idle: 8 },
            { category: "Coupe", reserved: 14, idle: 6 },
            { category: "Crossover", reserved: 28, idle: 9 }
        ];

        res.status(200).json({
            cars: carData,
            fleet: fleetData
        })

    } catch (err) {
        res.status(500).json({ message: "Server Error", error });
    }
}

