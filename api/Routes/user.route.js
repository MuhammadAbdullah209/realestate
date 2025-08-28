const express = require('express');
const router = express.Router();
const { SignUp, GetAllUsers, SignIn, Google, Update, Delete, SignOut } = require('../Controllers/Auth.controller');
const { VerifyToken } = require('../Utils/VerifiedUser');
const { getUserListing, getuser } = require('../Controllers/Listing.controller');


const { uploadMiddleware, uploadProfileImage } = require('../Controllers/user.listing');

router.post('/SignUp', SignUp);
router.post('/SignIn', SignIn);
router.get('/all', GetAllUsers);
router.post('/Google', Google);
router.post('/Update/:id', VerifyToken, Update);
router.delete('/Delete/:id', VerifyToken, Delete);
router.get('/SignOut/:id', SignOut);
router.get('/Listings/:id', VerifyToken, getUserListing);
router.get('/:id', VerifyToken, getuser);



router.post("/upload-profile/:id", uploadMiddleware.single("profile"), uploadProfileImage);

module.exports = router;
