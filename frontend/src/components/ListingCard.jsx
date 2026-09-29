import { formatPrice } from "../api/client";
import Photo from "./Photo";

export default function ListingCard({ item, type, children }) {
  const isSpot = type === "spot";
  const isHotel = type === "hotel";
  const photoType = isSpot ? "spot" : isHotel ? "hotel" : "restaurant";

  return (
    <article className="listing-card">
      <div className="listing-image">
        <Photo src={item.image} alt={item.name} type={photoType} credit={item.imageCredit} license={item.imageLicense} licenseUrl={item.imageLicenseUrl} sourceUrl={item.imageSourceUrl} />
        <span className="rating">{item.rating == null ? "Not rated" : `${item.rating.toFixed(1)} / 5`}</span>
      </div>
      <div className="listing-copy">
        <div className="listing-heading">
          <div>
            <span className="eyebrow">{isSpot ? "PLACE TO VISIT" : isHotel ? "STAY" : item.cuisine}</span>
            <h3>{item.name}</h3>
          </div>
        </div>
        {isSpot && <p className="listing-description">{item.description}</p>}
        <div className="listing-meta">
          {isSpot && <>
            {item.duration && <span>{item.duration}</span>}
            {item.bestTimeToVisit && <span>{item.bestTimeToVisit}</span>}
            {item.entryFee != null && <span>{item.entryFee === 0 ? "Free entry" : `Entry ${formatPrice(item.entryFee)}`}</span>}
          </>}
          {isHotel && <>
            <span>{item.location}</span>
            <span>{formatPrice(item.priceRange.min)}–{formatPrice(item.priceRange.max)} / night</span>
          </>}
          {!isSpot && !isHotel && <>
            <span>{item.location}</span>
            <span>{formatPrice(item.priceRange.min)}–{formatPrice(item.priceRange.max)} / person</span>
          </>}
        </div>
        {children}
      </div>
    </article>
  );
}