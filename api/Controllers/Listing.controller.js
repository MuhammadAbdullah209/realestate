const Listing = require("../Models/Listing.Model.js");
const User = require("../Models/user.model.js");
const ErrorHandler = require("../Utils/error.js");
const CreateListing = async (req, res, next) => {
    try {
        const listing = await Listing.create(req.body);
        return res.status(201).json({
            success: true,
            listing
        });
    } catch (error) {
        next(error);
    }
};
const getUserListing = async (req, res, next) => {
    if (req.user.id === req.params.id) {
        try {
            const listing = await Listing.find({ userref: req.params.id });
            res.status(200).json(listing);
        } catch (error) {
            next(error);
            console.log(error)
        }
    } else {
        return next(ErrorHandler(401, 'You can only view your listings!'));
    }
};
const DeleteListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id)
    if (!listing) return next(ErrorHandler('Listing Not Found'))
    // if (req.user.id !== listing.userref) return next(ErrorHandler('You can only Edit your OWn Listing'))
    try {
        await Listing.findByIdAndDelete(req.params.id)
        res.status(200).json('Your Listing has been deleted successfully')
    } catch (error) {
        console.log(error.message);
        next(error)
    }
}
const UpdateListing = async (req, res, next) => {
    try {
        const updatedListing = await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedListing) return next(ErrorHandler('Listing Not Found'));
        res.status(200).json({ success: true, listing: updatedListing });
    } catch (error) {
        console.log(error.message);
        next(error);
    }
};

const getListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id)
        if (!listing) return next(ErrorHandler(401, 'Listing not Found in the database!'))
        res.status(200).json(listing)
    } catch (error) {
        next(error)
    }
}

const getuser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) return next(ErrorHandler(404, 'User Not Found'))
        const { password: pass, ...rest } = user._doc
        const data = res.json(rest)
    } catch (error) {
        next(ErrorHandler(error))
    }

}
const getListings = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;
        let offer = req.query.offer;

        if (offer === undefined || offer === 'false') {
            offer = { $in: [false, true] };
        }

        let furnished = req.query.furnished;

        if (furnished === undefined || furnished === 'false') {
            furnished = { $in: [false, true] };
        }

        let parking = req.query.parking;

        if (parking === undefined || parking === 'false') {
            parking = { $in: [false, true] };
        }

        let type = req.query.type;

        if (type === undefined || type === 'all') {
            type = { $in: ['Sale', 'rent'] };
        }

        const searchTerm = req.query.searchTerm || '';

        const sort = req.query.sort || 'createdAt';

        const order = req.query.order || 'desc';

        const listings = await Listing.find({
            name: { $regex: searchTerm, $options: 'i' },
            offer,
            furnished,
            parking,
            type,
        })
            .sort({ [sort]: order })
            .limit(limit)
            .skip(startIndex);

        return res.status(200).json(listings);
    } catch (error) {
        next(error);
    }
};


module.exports = { CreateListing, getUserListing, DeleteListing, UpdateListing, getListing, getuser, getListings };
