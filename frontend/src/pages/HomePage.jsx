import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../api/client";
import DestinationCard from "../components/DestinationCard";
import { EmptyMessage, ErrorMessage, Loading } from "../components/Feedback";
import Photo from "../components/Photo";

function getActivityItem(activity) {
  return activity.kind === "spot" ? activity.spotId : activity.restaurantId;
}

export default function HomePage({ currentPlan }) {
  const [destinations, setDestinations] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest("/destinations")
      .then(setDestinations)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleSearch(event) {
    event.preventDefault();
    const name = query.trim();
    if (!name) {
      setError("Enter a destination to search.");
      setSearchResults(null);
      return;
    }

    setError("");
    setSearching(true);
    try {
      setSearchResults(await apiRequest(`/destinations/search?name=${encodeURIComponent(name)}`));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSearching(false);
    }
  }

  const hasNoSearchMatch = searchResults !== null && searchResults.length === 0;
  const shownDestinations = hasNoSearchMatch || searchResults === null ? destinations : searchResults;
  const savedPlanSection = currentPlan && (() => {
    const destination = currentPlan.destinationId;
    const activities = currentPlan.days.flatMap((day) => day.activities.map((activity) => ({ activity, item: getActivityItem(activity) })));
    return (
      <section className="content-section saved-plan-section" id="saved-plan">
        <div className="section-heading">
          <div><span className="eyebrow">YOUR CURRENT SESSION</span><h2>My trip</h2></div>
          <span className="section-note">The latest plan stays here while the app is open.</span>
        </div>
        <article className="saved-plan-card">
          <div className="saved-plan-gallery">
            <Photo src={destination.image} alt={destination.name} type="destination" loading="eager" credit={destination.imageCredit} license={destination.imageLicense} licenseUrl={destination.imageLicenseUrl} sourceUrl={destination.imageSourceUrl} />
            {activities.slice(0, 3).map(({ activity, item }, index) => (
              <Photo key={`${activity.kind}-${item?._id || index}`} src={item?.image} alt={item?.name || "Trip activity"} type={activity.kind === "spot" ? "spot" : "restaurant"} credit={item?.imageCredit} license={item?.imageLicense} licenseUrl={item?.imageLicenseUrl} sourceUrl={item?.imageSourceUrl} />
            ))}
          </div>
          <div className="saved-plan-copy">
            <span className="eyebrow">{destination.country} / {currentPlan.numberOfDays} DAYS</span>
            <h3>{destination.name}</h3>
            <p>{activities.length} planned {activities.length === 1 ? "activity" : "activities"}{currentPlan.hotelId ? ` / Staying at ${currentPlan.hotelId.name}` : ""}</p>
            {currentPlan.startDate && <p>Starting {new Date(`${currentPlan.startDate}T00:00:00`).toLocaleDateString("en-IN")}</p>}
            <Link className="button button-green" to={`/trip/${destination._id}`} state={{ plan: currentPlan }}>Continue this trip</Link>
          </div>
          <div className="saved-plan-days">
            {currentPlan.days.map((day) => (
              <div key={day.dayNumber}><strong>Day {day.dayNumber}</strong><span>{day.activities.length} {day.activities.length === 1 ? "activity" : "activities"}</span></div>
            ))}
          </div>
        </article>
      </section>
    );
  })();

  return (
    <main className="home-page">
      <section className="home-search-band">
        <div className="home-search-content">
          <div>
            <span className="eyebrow">PLAN YOUR TRIP</span>
            <h1>Find your destination</h1>
          </div>
          <form className="search-form" onSubmit={handleSearch}>
            <label className="visually-hidden" htmlFor="destination-search">Search destinations</label>
            <input id="destination-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search a city" />
            <button className="button button-coral" type="submit" disabled={searching}>{searching ? "Searching..." : "Search"}</button>
          </form>
          <ErrorMessage>{error}</ErrorMessage>
        </div>
      </section>

      {hasNoSearchMatch && <p className="search-miss-message" role="status">We’re working to add “{query.trim()}”. In the meantime, choose from these available destinations.</p>}
      {!hasNoSearchMatch && savedPlanSection}

      <section className={`content-section destination-section${hasNoSearchMatch ? " search-fallback-section" : ""}`}>
        <div className="section-heading">
          <div>
            <span className="eyebrow">{hasNoSearchMatch ? "MORE PLACES TO EXPLORE" : searchResults ? "SEARCH RESULTS" : "A FEW PLACES TO BEGIN"}</span>
            <h2>{hasNoSearchMatch ? "Choose an available destination" : searchResults ? `Places matching “${query.trim()}”` : "Pick a place. Start anywhere."}</h2>
          </div>
          {searchResults && <button className="text-button" onClick={() => { setSearchResults(null); setQuery(""); setError(""); }}>Show all destinations</button>}
        </div>
        {loading ? <Loading label="Finding destinations" /> : shownDestinations.length === 0
          ? <EmptyMessage>No destinations found. Try another city name.</EmptyMessage>
          : <div className="destination-grid">{shownDestinations.map((destination) => <DestinationCard key={destination._id} destination={destination} />)}</div>}
      </section>

      {hasNoSearchMatch && savedPlanSection}
    </main>
  );
}