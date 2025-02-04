const Listing = require('../model/listing.js')
const ExpressError = require('../utils/ExpressError.js')

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({})
    res.json(allListings)
};

module.exports.showListing = async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById({ _id: id }).populate({ path: "reviews", populate: { path: "author" } }).populate("owner")
    if (!listing) {
        next(new ExpressError(500, "chat not found"))
    }
    res.json(listing);
};

module.exports.createListing = async (req, res, next) => {
    let { title, description, price, country, location } = req.body;
    let url = req.file.path;
    let filename = req.file.pathname;
    const newListing = new Listing({ title, description, price, country, location, owner: req.user._id ,image:{url, filename}})
    // console.log(newListing)
    let result = await newListing.save()
    res.json(result)
};

module.exports.editListing = async (req, res, next) => {
    let { id } = req.params;
    const editListing = await Listing.findById({ _id: id })
    if(!editListing){
       next (new ExpressError(500, "Listing you requested does not exist"))
    }else{
    res.json(editListing)
   }
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let { title, description, price, country, location } = req.body;
    const updateListing = await Listing.findByIdAndUpdate({ _id: id }, { title, description, price, country, location }, { new: true })
    // console.log(req.file)
    if(typeof req.file !=="undefined"){
        let url = req.file.path;
        let filename = req.file.pathname;
        updateListing.image={url, filename}
        await updateListing.save();
    }
    res.json({ updateListing, success: "Listing updated" })
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete({ _id: id })
    res.json({ deletedListing, success: "Listing deleted" })
};



