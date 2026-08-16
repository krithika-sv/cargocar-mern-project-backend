const express = require("express")

const { registerController, loginController, updateUserProfileController } = require("../Controllers/usercontroller")
const { addCarcontroller, getCarsListAddedController, getcareditcontroller, deletecardatacontroller, getCarsAvailableController, getAIdata, getAIdataController } = require("../Controllers/carController")
const jwtAuthMiddleware = require("../middlewares/jwtAuthMiddleware")
const multerMiddleware = require("../middlewares/multerMiddleware")
const { bookCarController, getbookedcarsController, getsinglecarcontroller, updatebookingstatuscontroller, getuserbookingdata, getRazorpayController, getdashboarddataController, getchartdata } = require("../Controllers/bookingController")
const adminMiddleware = require("../middlewares/adminMiddleware")

//to set up routes outside express server,create object for router class of express

const router = new express.Router()

//user

//register
router.post("/register", registerController)

//login
router.post("/login", loginController)


//update profile  - user
router.put("/updateuser/:id", jwtAuthMiddleware, multerMiddleware.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "drivingLicenseFrontpage", maxCount: 1 },
    { name: "drivingLicenseBackpage", maxCount: 1 },
]),
    updateUserProfileController)



//get available car lists for user
router.get("/getavailablecars/user", jwtAuthMiddleware, getCarsAvailableController)

//to book car
router.post("/bookcar/:id", jwtAuthMiddleware, bookCarController)

//get user booking  data
router.get("/getbookinglist", jwtAuthMiddleware, getuserbookingdata)


//admin

//addcar
router.post("/addcar", adminMiddleware, addCarcontroller)


//get all car lists
router.get("/getavailablecars", adminMiddleware, getCarsListAddedController)

//edit car data
router.put("/editcardata/:id", adminMiddleware, getcareditcontroller)

//delete car data
router.delete("/deletecar/:id", adminMiddleware, deletecardatacontroller)

//get booked car data - admin

router.get("/getbookedcars/admin", adminMiddleware, getbookedcarsController)

// get single car data - admin

router.get("/getsinglecar/:id", adminMiddleware, getsinglecarcontroller)

//update car booking status

router.put("/updatebookingstatus/:id", adminMiddleware, updatebookingstatuscontroller)

//razorpay 

router.post("/order/:id", jwtAuthMiddleware, getRazorpayController)


//get total dashboard data

router.get("/dashboarddata", adminMiddleware, getdashboarddataController)

//chart data

router.get("/chartdata", adminMiddleware, getchartdata)

//get AI itinery data

router.post("/AIdata", getAIdataController)

module.exports = router