import React, { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import {
  DeleteUserFailure,
  DeleteUserStart,
  DeleteUserSuccess,
  SignInSuccess,
  SignOutStart,
  SignOutSuccess,
} from "../Redux/user/userSlice";
import { Link } from "react-router-dom";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const imgRef = useRef(null);
  const [formData, setFormData] = useState({
    username: currentUser?.username || "",
    email: currentUser?.email || "",
    password: "",
    avatar: currentUser?.avatar || "",
  });
  const [preview, setPreview] = useState(currentUser?.avatar || "");
  const [loading, setLoading] = useState(false);
  const [showlisting, setshowlisting] = useState([]);
  const [showlistingerror, setshowlistingerror] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("profile", file);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/Api/Profile/upload-profile/${
          currentUser._id
        }`,
        formDataUpload,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      dispatch(SignInSuccess(res.data.user));
      setFormData((prev) => ({ ...prev, avatar: res.data.url }));
    } catch (err) {
      console.error("Image upload failed:", err.response?.data || err.message);
      alert("Failed to upload image.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dataToSend = { ...formData };
      if (!dataToSend.password) delete dataToSend.password;
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/Api/Auth/Update/${currentUser._id}`,
        dataToSend,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      dispatch(SignInSuccess(res.data));
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(
        "Failed to update user:",
        err.response?.data || err.message
      );
      alert("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const HandleDeleteAccount = async () => {
    try {
      dispatch(DeleteUserStart());
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/Api/Auth/Delete/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (data.success === false) {
        dispatch(DeleteUserFailure(data.message));
        return;
      }
      dispatch(DeleteUserSuccess(data), console.log(data));
    } catch (error) {
      console.log(error);
      dispatch(DeleteUserFailure(error.message));
    }
  };

  const HanldeSignOutUser = async () => {
    try {
      dispatch(SignOutStart());
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/Api/Auth/SignOut`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (data.success === false) {
        dispatch(DeleteUserFailure(data.message));
        return;
      }
      dispatch(SignOutSuccess());
    } catch (error) {
      dispatch(DeleteUserFailure(error.message));
    }
  };

  const HandleShowListing = async () => {
    try {
      setshowlistingerror(false);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/Api/Auth/Listings/${currentUser._id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await res.json();
      console.log("API response for listings:", data);
      const listingsArray = Array.isArray(data)
        ? data
        : Array.isArray(data.data)
        ? data.data
        : Array.isArray(data.listings)
        ? data.listings
        : [];
      setshowlisting(listingsArray);
      if (listingsArray.length === 0) {
        setshowlistingerror(true);
      }
    } catch (error) {
      console.error(error);
      setshowlistingerror(true);
    }
  };

  const handleCloseCard = () => {
    setshowlisting(false);
  };

  const handleDeleteListing = async (listingid) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/Api/Listings/Delete/${listingid}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setshowlisting((prev) =>
        prev.filter((listing) => listing._id !== listingid)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
        <h1 className="text-3xl font-bold mb-6">
          <span className="text-blue-600">Pro</span>file
        </h1>
        <input type="file" ref={imgRef} hidden onChange={handleImageUpload} />
        <div className="relative w-24 h-24 rounded-full bg-gray-300 mb-6 border-4 border-white shadow-md overflow-hidden">
          <img
            src={preview || "/default-profile.png"}
            alt="Profile"
            onClick={() => imgRef.current.click()}
            className="absolute inset-0 w-full h-full object-cover cursor-pointer"
          />
        </div>
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
          <input
            type="password"
            name="password"
            placeholder="New Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 rounded-md hover:bg-gray-900 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Updating..." : "UPDATE"}
          </button>
          <Link
            to="/Create-Listing"
            className="block text-center w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
          >
            CREATE LISTING
          </Link>
          <button
            type="button"
            className="block text-center w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            onClick={HandleShowListing}
          >
            View Listings
          </button>
          <p className="text-red-700 mt-5">
            {showlistingerror && "Error Showing Listings"}
          </p>
        </form>
        <div className="flex space-x-4 mt-6">
          <button
            className="text-red-600 font-semibold hover:underline"
            onClick={HandleDeleteAccount}
          >
            Delete Account
          </button>
          <button
            className="text-red-600 font-semibold hover:underline"
            onClick={HanldeSignOutUser}
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Listings Section */}
      <div className="w-full max-w-4xl mx-auto mt-6 px-4">
        {showlistingerror && (
          <p className="text-red-700">
            Error Showing Listing or no listings found
          </p>
        )}
        {Array.isArray(showlisting) && showlisting.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {showlisting.map((listing) => (
              <div
                key={listing._id}
                className="relative bg-white shadow p-4 rounded mb-4 w-full max-w-md mx-auto"
              >
                <button
                  onClick={() => handleCloseCard(listing._id)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl"
                  title="Close"
                >
                  &times;
                </button>

                {/* Thumbnail image */}
                {listing.imageUrls && listing.imageUrls.length > 0 ? (
                  <img
                    src={listing.imageUrls[0]}
                    alt={listing.title || "Listing Thumbnail"}
                    className="w-full h-40 object-cover rounded mb-3"
                  />
                ) : (
                  <img
                    src="/default-thumbnail.png"
                    alt="Default Thumbnail"
                    className="w-full h-40 object-cover rounded mb-3"
                  />
                )}

                <h3 className="text-lg font-bold text-gray-800">
                  {listing.title || listing.name || "Untitled"}
                </h3>
                <p className="text-gray-600">
                  Price: ${listing.regularprice || listing.cost || "N/A"}
                </p>
                <p className="text-gray-500 text-sm">
                  Address: {listing.address || "N/A"}
                </p>
                <div className="flex justify-between mt-4">
                  <Link
                    to={`/Edit-Listing/${listing._id}`}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded text-sm"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteListing(listing._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
