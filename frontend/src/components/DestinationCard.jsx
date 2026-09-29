import { Link } from "react-router-dom";
import Photo from "./Photo";

export default function DestinationCard({ destination }) {
  return (
    <Link className="destination-card" to={`/destination/${destination._id}`}>
      <div className="destination-card-image">
        <Photo src={destination.image} type="destination" alt={`${destination.name}, ${destination.country}`} credit={destination.imageCredit} license={destination.imageLicense} licenseUrl={destination.imageLicenseUrl} sourceUrl={destination.imageSourceUrl} />
        <span className="image-arrow" aria-hidden="true">↗</span>
      </div>
      <div className="destination-card-copy">
        <span className="eyebrow">{destination.country}</span>
        <h3>{destination.name}</h3>
        <p>{destination.bestTimeToVisit?.from && destination.bestTimeToVisit?.to
          ? `${destination.bestTimeToVisit.from} to ${destination.bestTimeToVisit.to}`
          : "A place to explore"}</p>
      </div>
    </Link>
  );
}