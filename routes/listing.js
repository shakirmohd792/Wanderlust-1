const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const { isLoggedIn, isOwner, validateListing } = require('../authencationMW.js');
const listingController = require('../controllers/listing.js')
const multer  = require('multer')
const {storage} = require('../cloudConfig.js')
const upload = multer({storage})

// Home route
router.get('/', wrapAsync(listingController.index));

// Show Route
router.get('/:id', wrapAsync(listingController.showListing))

// Create Route
router.post('/', 
    isLoggedIn, 
    upload.single('image'), 
    validateListing,
    wrapAsync(listingController.createListing)
);

// Edit Route
router.get('/edit/:id', isLoggedIn, wrapAsync(listingController.editListing));

// Update Route
router.put('/:id', isLoggedIn, isOwner, upload.single('image'), validateListing,wrapAsync(listingController.updateListing));

// Delete Route
router.delete('/:id', isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

module.exports = router
