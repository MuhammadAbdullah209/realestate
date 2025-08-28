import React from "react";
import { Link } from "react-router-dom";
import { FaBed, FaBath } from "react-icons/fa";
const ListingItems = ({ listing }) => {
    return (
        <Link
            to={`/listing/${listing._id}`}
            className="block hover:scale-105 transform transition duration-300"
        >
            <div className="max-w-sm rounded-xl overflow-hidden shadow-lg bg-white">
                <div className="h-48 w-full bg-gray-200">
                    <img
                        src={listing.imageUrls && listing.imageUrls.length > 0 ? listing.imageUrls[0] : "/no-image.png"}
                        alt={listing.name}
                        className="w-full h-48 object-cover rounded-lg"
                    />
                </div>
                <div className="p-4">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">
                        {listing?.name || "Listing Name"}
                    </h2>
                    <p className="text-gray-600 text-sm mb-4">
                        {listing?.descrption || "This is a short description of the listing."}
                    </p>
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-green-600 font-bold">
                            {listing?.regularprice ? `$${listing.regularprice}` : "$000"}
                        </span>
                        <span className="bg-blue-100 text-blue-600 text-xs px-3 py-1 rounded-full">
                            {listing?.type || "Type"}
                        </span>
                    </div>

                    <div className="flex gap-4 text-sm text-gray-700">
                        <div className="flex items-center gap-1">
                            <FaBed className="text-blue-600" />
                            <span>{listing?.bedrooms || 0} Beds</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <FaBath className="text-blue-600" />
                            <span>{listing?.bathrooms || 0} Baths</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ListingItems;
