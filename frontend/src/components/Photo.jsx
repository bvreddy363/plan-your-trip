import { useState } from "react";

const fallbackPhotos = {
  destination: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1000&q=85",
  spot: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1000&q=85",
  hotel: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=85",
  restaurant: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=85",
};

export default function Photo({ src, alt, type = "spot", className = "", loading = "lazy", credit, license, licenseUrl, sourceUrl }) {
  const fallback = fallbackPhotos[type] || fallbackPhotos.spot;
  const [imageFailed, setImageFailed] = useState(false);

  function useFallback(event) {
    const image = event.currentTarget;
    if (!imageFailed && image.src !== fallback) {
      setImageFailed(true);
      image.src = fallback;
    }
    else image.classList.add("photo-unavailable");
  }

  return (
    <span className={`photo-frame ${className}`}>
      <img className="site-photo" src={src || fallback} alt={alt} loading={loading} onError={useFallback} />
      {credit && !imageFailed && <span className="photo-credit">
        {sourceUrl && <a href={sourceUrl} target="_blank" rel="noreferrer">Photo: {credit}</a>}
        {!sourceUrl && <span>Photo: {credit}</span>}
        {license && <>{" · "}{licenseUrl ? <a href={licenseUrl} target="_blank" rel="noreferrer">{license}</a> : license}</>}
      </span>}
    </span>
  );
}