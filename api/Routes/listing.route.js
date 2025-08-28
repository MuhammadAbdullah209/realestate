const express = require('express')
const { CreateListing, getUserListing, DeleteListing, UpdateListing, getListing, getListings } = require('../Controllers/Listing.controller')
const { VerifyToken } = require('../Utils/VerifiedUser')
const upload = require("../Utils/multer");

const router = express.Router()
router.post('/Create', VerifyToken, CreateListing)
router.get('/Listings/:id', VerifyToken, getUserListing);
router.delete('/Delete/:id', VerifyToken, DeleteListing)
router.post('/Update/:id', VerifyToken, UpdateListing)
router.get('/getListing/:id', getListing)
router.get('/get', getListings)



module.exports = router
