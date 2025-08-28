const { default: mongoose } = require('mongoose')
const Mongoose = require('mongoose')
const ListingSchema = new Mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        descrption: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        regularprice: {
            type: Number,
            required: true
        },
        discountprice: {
            type: Number,
            required: true
        },
        bathrooms: {
            type: Number,
            required: true
        },
        bedrooms: {
            type: Number,
            required: true
        },
        furnished: {
            type: Boolean,
            required: true
        },
        parking: {
            type: Boolean,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        offer: {
            type: Boolean,
            required: true
        },
        imageUrls: {
            type: Array,
            required: true
        },
        userref: {
            type: String,
            required: true
        }
    }, { timestamps: true }

)
const Listing = mongoose.model('Listing', ListingSchema)
module.exports = Listing