import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiRequest, formatPrice } from "../api/client";
import ListingCard from "../components/ListingCard";
import { EmptyMessage, ErrorMessage, Loading } from "../components/Feedback";
import Photo from "../components/Photo";

function toQuery(values) {
  const params = new URLSearchParams();
  Object.entries(values).forEach(([key, value]) => {
    if (value !== "") params.set(key, value);
  });
  return params.toString();
}

export default function DestinationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);
  const [spots, setSpots] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listingLoading, setListingLoading] = useState(false);
  const [error, setError] = useState("");
  const [filterError, setFilterError] = useState("");
  const [hotelFilters, setHotelFilters] = useState({ sort: "rating", minPrice: "", maxPrice: "" });
  const [restaurantFilters, setRestaurantFilters] = useState({ sort: "rating", cuisine: "", minPrice: "", maxPrice: "" });
  const [days, setDays] = useState(3);
  const [startDate, setStartDate] = useState("");

  useEffect(() => {
    Promise.all([
      apiRequest(`/destinations/${id}`),
      apiRequest(`/destinations/${id}/spots`),
    ])
      .then(([destinationData, spotData]) => {
        setDestination(destinationData);
        setSpots(spotData);
        setError("");
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!destination) return;
    const hotelQuery = toQuery(hotelFilters);
    const restaurantQuery = toQuery(restaurantFilters);
    Promise.all([
      apiRequest(`/destinations/${id}/hotels${hotelQuery ? `?${hotelQuery}` : ""}`),
      apiRequest(`/destinations/${id}/restaurants${restaurantQuery ? `?${restaurantQuery}` : ""}`),
    ])
      .then(([hotelData, restaurantData]) => {
        setHotels(hotelData);
        setRestaurants(restaurantData);
        setFilterError("");
      })
      .catch((requestError) => setFilterError(requestError.message))
      .finally(() => setListingLoading(false));
  }, [destination, hotelFilters, id, restaurantFilters]);

  function createTrip(event) {
    event.preventDefault();
    const dayCount = Number(days);
    if (!Number.isInteger(dayCount) || dayCount < 1) {
      setError("Choose at least one trip day.");
      return;
    }
    setError("");
    const plan = {
      _id: `${id}-${Date.now()}`,
      destinationId: destination,
      numberOfDays: dayCount,
      hotelId: null,
      startDate,
      days: Array.from({ length: dayCount }, (_, index) => ({ dayNumber: index + 1, activities: [] })),
      spots,
      hotels,
      restaurants,
    };
    navigate(`/trip/${id}`, { state: { plan } });
  }

  if (loading) return <main className="page-shell"><Loading label="Finding this destination" /></main>;
  if (error && !destination) return <main className="page-shell"><ErrorMessage>{error}</ErrorMessage></main>;

  const bestTime = destination?.bestTimeToVisit;
  const cuisines = [...new Set(restaurants.map((restaurant) => restaurant.cuisine))].sort();

  return (
    <main>
      {destination && <section className="destination-hero">
        <Photo className="destination-hero-photo" src={destination.image} type="destination" alt={`${destination.name}, ${destination.country}`} loading="eager" credit={destination.imageCredit} license={destination.imageLicense} licenseUrl={destination.imageLicenseUrl} sourceUrl={destination.imageSourceUrl} />
        <div className="destination-hero-content">
          <span className="eyebrow hero-eyebrow">{destination.country} / DESTINATION GUIDE</span>
          <h1>{destination.name}</h1>
          <p>{destination.description}</p>
          {bestTime?.from && <div className="best-time"><span>BEST TIME TO VISIT</span><strong>{bestTime.from} to {bestTime.to}</strong></div>}
        </div>
      </section>}

      <section className="plan-strip">
        <div><span className="eyebrow">MAKE IT YOURS</span><h2>Ready to make a plan?</h2></div>
        <form className="quick-plan-form" onSubmit={createTrip}>
          <label>Days<input type="number" min="1" step="1" value={days} onChange={(event) => setDays(event.target.value)} /></label>
          <label>Start date<input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} /></label>
          <button className="button button-green">Build my itinerary</button>
        </form>
        <ErrorMessage>{error}</ErrorMessage>
      </section>

      <section className="content-section listing-section">
        <div className="section-heading"><div><span className="eyebrow">01 / GO SEE</span><h2>Places worth your time</h2></div></div>
        {spots.length === 0 ? <EmptyMessage>No tourist spots have been added yet.</EmptyMessage> : <div className="listing-grid">{spots.map((spot) => <ListingCard key={spot._id} item={spot} type="spot" />)}</div>}
      </section>

      <section className="content-section listing-section tinted-section">
        <div className="section-heading"><div><span className="eyebrow">02 / STAY AWHILE</span><h2>Places to stay</h2></div><span className="section-note">Prices per room, per night</span></div>
        <div className="filter-bar">
          <label>Sort<select value={hotelFilters.sort} onChange={(event) => setHotelFilters({ ...hotelFilters, sort: event.target.value })}><option value="rating">Top rated</option><option value="name">Name</option></select></label>
          <label>Min price<input type="number" min="0" placeholder={formatPrice(0)} value={hotelFilters.minPrice} onChange={(event) => setHotelFilters({ ...hotelFilters, minPrice: event.target.value })} /></label>
          <label>Max price<input type="number" min="0" placeholder="No limit" value={hotelFilters.maxPrice} onChange={(event) => setHotelFilters({ ...hotelFilters, maxPrice: event.target.value })} /></label>
        </div>
        <ErrorMessage>{filterError}</ErrorMessage>
        {listingLoading ? <Loading label="Updating stays" /> : hotels.length === 0 ? <EmptyMessage>No stays match these filters.</EmptyMessage> : <div className="listing-grid">{hotels.map((hotel) => <ListingCard key={hotel._id} item={hotel} type="hotel" />)}</div>}
      </section>

      <section className="content-section listing-section">
        <div className="section-heading"><div><span className="eyebrow">03 / EAT WELL</span><h2>Pull up a chair</h2></div><span className="section-note">Prices per person</span></div>
        <div className="filter-bar">
          <label>Sort<select value={restaurantFilters.sort} onChange={(event) => setRestaurantFilters({ ...restaurantFilters, sort: event.target.value })}><option value="rating">Top rated</option><option value="name">Name</option></select></label>
          <label>Cuisine<select value={restaurantFilters.cuisine} onChange={(event) => setRestaurantFilters({ ...restaurantFilters, cuisine: event.target.value })}><option value="">All cuisines</option>{cuisines.map((cuisine) => <option key={cuisine} value={cuisine}>{cuisine}</option>)}</select></label>
          <label>Min price<input type="number" min="0" placeholder={formatPrice(0)} value={restaurantFilters.minPrice} onChange={(event) => setRestaurantFilters({ ...restaurantFilters, minPrice: event.target.value })} /></label>
          <label>Max price<input type="number" min="0" placeholder="No limit" value={restaurantFilters.maxPrice} onChange={(event) => setRestaurantFilters({ ...restaurantFilters, maxPrice: event.target.value })} /></label>
        </div>
        {listingLoading ? <Loading label="Updating restaurants" /> : restaurants.length === 0 ? <EmptyMessage>No restaurants match these filters.</EmptyMessage> : <div className="listing-grid">{restaurants.map((restaurant) => <ListingCard key={restaurant._id} item={restaurant} type="restaurant" />)}</div>}
      </section>
    </main>
  );
}