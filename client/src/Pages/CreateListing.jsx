import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CreateListing = () => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setloading] = useState(false);
  const [showListing, setShowListing] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const Navigator = useNavigate();

  const [formdata, setFormData] = useState({
    name: "",
    descrption: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularprice: 50,
    discountprice: 50,
    offer: false,
    parking: false,
    furnished: false,
  });

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    if (name === "type") {
      setFormData((prev) => ({
        ...prev,
        type: value,
      }));
    } else if (name === "parking" || name === "furnished" || name === "offer") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? Number(value) : value,
      }));
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    setloading(true);
    setError(false);

    // Step 1: Create listing (without images)
    const res = await fetch("/Api/Listings/Create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formdata,
        userref: currentUser._id,
      }),
    });

    const data = await res.json();
    if (data.success === false) {
      setError(data.message || "Something went wrong");
      setloading(false);
      return;
    }

    const listingId = data.listing._id;

    // Step 2: Upload images if any
    if (files.length > 0) {
      const formDataToSend = new FormData();

      // must match backend: upload.array("images", 6)
      files.forEach((file) => {
        formDataToSend.append("images", file);
      });

      const uploadRes = await fetch(`/Api/Listing-uploads/upload/${listingId}`, {
        method: "POST",
        body: formDataToSend, // no headers needed for FormData
      });

      const uploadData = await uploadRes.json();
      if (uploadData.success === false) {
        setError(uploadData.message || "Image upload failed");
        setloading(false);
        return;
      }
    }

    setloading(false);
    Navigator(`/Listing/${listingId}`);
  } catch (error) {
    setError(error.message);
    setloading(false);
  }
};


  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-8">Create a Listing</h1>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowListing(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          View Listing
        </button>
      </div>

      {showListing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-2xl p-6 rounded-xl shadow-lg relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowListing(false)}
              className="absolute top-4 right-4 text-2xl font-bold text-gray-700 hover:text-red-600"
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold mb-4">
              {formdata.name || "Listing Preview"}
            </h2>
            <p className="text-gray-600 mb-2">
              <strong>Address:</strong> {formdata.address}
            </p>
            <p className="text-gray-700 mb-4">{formdata.descrption}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <p>
                <strong>Type:</strong> {formdata.type}
              </p>
              <p>
                <strong>Bedrooms:</strong> {formdata.bedrooms}
              </p>
              <p>
                <strong>Bathrooms:</strong> {formdata.bathrooms}
              </p>
              <p>
                <strong>Parking:</strong> {formdata.parking ? "Yes" : "No"}
              </p>
              <p>
                <strong>Furnished:</strong> {formdata.furnished ? "Yes" : "No"}
              </p>
              <p>
                <strong>Offer:</strong> {formdata.offer ? "Yes" : "No"}
              </p>
              <p>
                <strong>Price:</strong> ${formdata.regularprice}
              </p>
              {formdata.offer && (
                <p>
                  <strong>Discount Price:</strong> ${formdata.discountprice}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 shadow-xl rounded-2xl space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            name="name"
            
              data-gramm="false"
            placeholder="Name"
            className="input"
            value={formdata.name}
            required
            onChange={handleChange}
          />
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Address
          </label>
          <input
            type="text"
            name="address"
            placeholder="Address"
            className="input col-span-3"
            value={formdata.address}
              data-gramm="false"
            required
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="descrption"
            placeholder="Write a detailed description about the property..."
            rows="5"
              data-gramm="false"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            onChange={handleChange}
            value={formdata.descrption}
          ></textarea>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-medium text-gray-700">
          <label>
            <input
              type="checkbox"
              name="type"
              value="Sale"
              onChange={handleChange}
              checked={formdata.type === "Sale"}
              className="mr-2"
            />{" "}
            Sell
          </label>
          <label>
            <input
              type="checkbox"
              name="type"
              value="rent"
              onChange={handleChange}
              checked={formdata.type === "rent"}
              className="mr-2"
            />{" "}
            Rent
          </label>
          <label>
            <input
              type="checkbox"
              name="parking"
              className="mr-2"
              onChange={handleChange}
              checked={formdata.parking}
            />{" "}
            Parking Spot
          </label>
          <label>
            <input
              type="checkbox"
              name="furnished"
              className="mr-2"
              onChange={handleChange}
              checked={formdata.furnished}
            />{" "}
            Furnished
          </label>
        </div>
        <label className="block text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            name="offer"
            className="mr-2"
            onChange={handleChange}
            checked={formdata.offer}
          />{" "}
          Offer Available
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <input
              type="number"
              name="bedrooms"
              min="1"
              placeholder="Bedrooms"
              className="input"
              onChange={handleChange}
              value={formdata.bedrooms}
            />
            <p className="text-sm text-gray-600 mt-1">
              Bedrooms: {formdata.bedrooms}
            </p>
          </div>
          <div>
            <input
              type="number"
              name="bathrooms"
              min="1"
              placeholder="Bathrooms"
              className="input"
              onChange={handleChange}
              value={formdata.bathrooms}
            />
            <p className="text-sm text-gray-600 mt-1">
              Bathrooms: {formdata.bathrooms}
            </p>
          </div>
          <div>
            <input
              type="number"
              name="regularprice"
              placeholder="Regular Price ($/month)"
              min={50}
              max={10000000}
              className="input"
              onChange={handleChange}
              value={formdata.regularprice}
            />
            <p className="text-sm text-gray-600 mt-1">
              Regular Price: ${formdata.regularprice}
            </p>
          </div>
        </div>
        {formdata.offer && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <input
                type="number"
                name="discountprice"
                placeholder="Discounted Price ($/month)"
                min={50}
                max={formdata.regularprice}
                className="input"
                onChange={handleChange}
                value={formdata.discountprice}
              />
              <p className="text-sm text-gray-600 mt-1">
                Discounted Price: ${formdata.discountprice}
              </p>
            </div>
          </div>
        )}
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            Upload Images (max 6)
          </label>
          <div className="flex items-center gap-4">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setFiles(Array.from(e.target.files))}
              className="file-input"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-800 transition text-lg font-semibold"
        >
          {loading ? "Creating..." : "Create Listing"}
        </button>
        {error && <p className="text-red-700 text-sm">{error}</p>}
      </form>
    </div>
  );
};

export default CreateListing;
