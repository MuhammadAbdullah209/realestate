import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaBed, FaBath, FaCar } from "react-icons/fa";
import { MdCheckCircle, MdCancel } from "react-icons/md";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Contact from "../Components/Contact";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const ListingPage = () => {
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setloading] = useState(false);
  const [error, setError] = useState(false);
  const [contact, setContact] = useState(false);
  const currentUser = useSelector((state) => state.user.currentUser);
  console.log(currentUser);

  useEffect(() => {
    const fetchlisting = async () => {
      try {
        setloading(true);
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/Api/Listings/getListing/${
            params.id
          }`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setloading(false);
          console.log(data.message);
          return;
        }
        setListing(data);
        setloading(false);
      } catch (error) {
        setError(true);
        setloading(false);
        console.log(error.message);
      }
    };
    fetchlisting();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Something Went Wrong</p>;

  return (
    <div className="w-full bg-gray-100 min-h-screen flex items-center justify-center">
      {listing && (
        <div className="max-w-4xl w-full mx-auto px-6 py-8 bg-white rounded-3xl shadow-lg">
          <div className="mb-6">
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              spaceBetween={20}
              slidesPerView={1}
              className="rounded-2xl shadow-md"
            >
              {listing.imageUrls && listing.imageUrls.length > 0 && (
                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {listing.imageUrls.map((url, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={url}
                        alt={`House ${index + 1}`}
                        className="w-full h-64 object-cover rounded-xl"
                      />
                    </SwiperSlide>
                  ))}
                </div>
              )}
            </Swiper>
          </div>

          <div className="flex items-baseline justify-between flex-wrap gap-2">
            <h2 className="text-3xl font-semibold text-gray-900">
              {listing.name}
            </h2>
            <span className="text-green-700 font-bold text-2xl">
              ${listing.regularprice}
              {listing.type === "rent" && (
                <span className="text-lg font-normal"> / month</span>
              )}
            </span>
          </div>

          <div className="flex items-center gap-4 mt-3 flex-wrap">
            <p className="flex items-center text-gray-600 text-sm">
              <FaMapMarkerAlt className="mr-1 text-green-600" />
              {listing.address}
            </p>
            <span
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                listing.type === "rent"
                  ? "bg-red-600 text-white"
                  : "bg-green-600 text-white"
              }`}
            >
              {listing.type === "rent" ? "For Rent" : "For Sale"}
            </span>
          </div>

          <div className="mt-6">
            <h3 className="font-bold text-lg text-gray-800">Description:</h3>
            <p className="text-gray-700 mt-1 leading-relaxed">
              {listing.descrption}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-8">
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm">
              <FaBed className="text-blue-700" />
              {listing.bedrooms} Beds
            </div>
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm">
              <FaBath className="text-blue-700" />
              {listing.bathrooms} Baths
            </div>
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm">
              {listing.parking ? (
                <>
                  <FaCar className="text-blue-700" />
                  Parking
                </>
              ) : (
                <>
                  <MdCancel className="text-red-700" />
                  No Parking
                </>
              )}
            </div>
            {listing.offer && (
              <div className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full text-sm font-medium text-green-800">
                Offer: -${listing.discountprice}
              </div>
            )}
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm">
              {listing.furnished ? (
                <>
                  <MdCheckCircle className="text-green-700" />
                  Furnished
                </>
              ) : (
                <>
                  <MdCancel className="text-red-700" />
                  Not furnished
                </>
              )}
            </div>
          </div>

          {currentUser && listing.userref !== currentUser._id && !contact && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setContact(true)}
                className="bg-black text-white px-6 py-3 rounded-full text-lg font-medium shadow-md hover:bg-gray-800 transition duration-300"
              >
                Contact Agent
              </button>
              <button onClick={() => setContact(false)}></button>
            </div>
          )}
          {contact && (
            <Contact listing={listing} onClose={() => setContact(false)} />
          )}
        </div>
      )}
    </div>
  );
};

export default ListingPage;
