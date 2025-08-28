import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ListingItems from "../Components/ListingItems.jsx";

const Home = () => {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch("/Api/Listings/get?offer=true&limit=4");
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch("/Api/Listings/get?type=rent&limit=4");
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch("/Api/Listings/get?type=sale&limit=4");
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOfferListings();
  }, []);

  return (
    <div>

      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find your next <span className="text-slate-500">perfect</span>
          <br />
          place with ease
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          Dream Estate is the best place to find your next perfect place to
          live.
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        <Link
          to={"/search"}
          className="text-xs sm:text-sm text-blue-800 font-bold hover:underline"
        >
          Let's get started...
        </Link>
      </div>


      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {offerListings.length > 0 && (
          <Section
            title="Recent offers"
            link="/search?offer=true"
            listings={offerListings}
          />
        )}
        {rentListings.length > 0 && (
          <Section
            title="Recent places for rent"
            link="/search?type=rent"
            listings={rentListings}
          />
        )}
        {saleListings.length > 0 && (
          <Section
            title="Recent places for sale"
            link="/search?type=sale"
            listings={saleListings}
          />
        )}
      </div>
    </div>
  );
};

const Section = ({ title, link, listings }) => (
  <div>
    <div className="my-3 flex justify-between items-center">
      <h2 className="text-2xl font-semibold text-slate-600">{title}</h2>
      <Link className="text-sm text-blue-800 hover:underline" to={link}>
        Show more
      </Link>
    </div>
    <div className="flex flex-wrap gap-4">
      {listings.map((listing) => (
        <ListingItems key={listing._id} listing={listing} />
      ))}
    </div>
  </div>
);

export default Home;
