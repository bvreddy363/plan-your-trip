import { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { formatPrice, getId } from "../api/client";
import { EmptyMessage, ErrorMessage } from "../components/Feedback";
import Photo from "../components/Photo";
import TripDay from "../components/TripDay";

function reorderActivities(days, dayIndex) {
  return days.map((day, index) => index === dayIndex
    ? { ...day, activities: day.activities.map((activity, order) => ({ ...activity, order })) }
    : day);
}

function validateSchedule(days) {
  const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

  for (const day of days) {
    const ranges = [];
    for (const activity of day.activities) {
      if (!timePattern.test(activity.startTime || "") || !timePattern.test(activity.endTime || "")) {
        return `Add a valid start and end time to every activity on Day ${day.dayNumber}.`;
      }

      const start = Number(activity.startTime.slice(0, 2)) * 60 + Number(activity.startTime.slice(3));
      const end = Number(activity.endTime.slice(0, 2)) * 60 + Number(activity.endTime.slice(3));
      if (end <= start) return `End time must be later than start time on Day ${day.dayNumber}.`;
      if (ranges.some((range) => start < range.end && end > range.start)) {
        return `Activity times cannot overlap on Day ${day.dayNumber}.`;
      }
      ranges.push({ start, end });
    }
  }

  return "";
}

export default function TripPage({ currentPlan, onSavePlan }) {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const routePlan = location.state?.plan;
  const sessionPlan = currentPlan && getId(currentPlan.destinationId) === id ? currentPlan : null;
  const initialPlan = routePlan || sessionPlan;
  const [trip, setTrip] = useState(initialPlan);
  const [spots] = useState(initialPlan?.spots || []);
  const [restaurants] = useState(initialPlan?.restaurants || []);
  const [hotels] = useState(initialPlan?.hotels || []);
  const [targetDay, setTargetDay] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  function updateTrip(change) {
    setTrip((current) => ({ ...current, ...change }));
    setNotice("You have unsaved changes.");
  }

  function addActivity(kind, item) {
    const itemId = getId(item);
    const exists = trip.days.some((day) => day.activities.some((activity) =>
      activity.kind === kind && getId(kind === "spot" ? activity.spotId : activity.restaurantId) === itemId));
    if (exists) {
      setError("That place is already in this itinerary.");
      return;
    }
    setError("");
    setNotice("You have unsaved changes.");
    setTrip((current) => ({
      ...current,
      days: current.days.map((day, index) => index === targetDay
        ? { ...day, activities: [...day.activities, { kind, spotId: kind === "spot" ? item : undefined, restaurantId: kind === "restaurant" ? item : undefined, order: day.activities.length }] }
        : day),
    }));
  }

  function removeActivity(dayIndex, activityIndex) {
    const days = trip.days.map((day, index) => index === dayIndex
      ? { ...day, activities: day.activities.filter((_, itemIndex) => itemIndex !== activityIndex).map((activity, order) => ({ ...activity, order })) }
      : day);
    updateTrip({ days });
  }

  function changeActivityTime(dayIndex, activityIndex, field, value) {
    const days = trip.days.map((day, index) => index === dayIndex
      ? { ...day, activities: day.activities.map((activity, itemIndex) => itemIndex === activityIndex ? { ...activity, [field]: value } : activity) }
      : day);
    updateTrip({ days });
  }

  function moveActivity(dayIndex, activityIndex, nextDayIndex) {
    if (dayIndex === nextDayIndex) return;
    const activity = trip.days[dayIndex].activities[activityIndex];
    const days = trip.days.map((day, index) => {
      if (index === dayIndex) return { ...day, activities: day.activities.filter((_, itemIndex) => itemIndex !== activityIndex).map((item, order) => ({ ...item, order })) };
      if (index === nextDayIndex) return { ...day, activities: [...day.activities, { ...activity, order: day.activities.length }] };
      return day;
    });
    updateTrip({ days });
  }

  function reorderActivity(dayIndex, activityIndex, direction) {
    const nextIndex = activityIndex + direction;
    const activities = [...trip.days[dayIndex].activities];
    [activities[activityIndex], activities[nextIndex]] = [activities[nextIndex], activities[activityIndex]];
    const days = trip.days.map((day, index) => index === dayIndex ? { ...day, activities } : day);
    updateTrip({ days: reorderActivities(days, dayIndex) });
  }

  function changeDayCount(value) {
    const numberOfDays = Number(value);
    if (!Number.isInteger(numberOfDays) || numberOfDays < 1) return;
    if (numberOfDays < trip.numberOfDays && trip.days.slice(numberOfDays).some((day) => day.activities.length > 0)) {
      setError("Move or remove activities from the last days before shortening this trip.");
      return;
    }
    setError("");
    const days = trip.days.slice(0, numberOfDays);
    while (days.length < numberOfDays) days.push({ dayNumber: days.length + 1, activities: [] });
    updateTrip({ numberOfDays, days: days.map((day, index) => ({ ...day, dayNumber: index + 1 })) });
    setTargetDay((current) => Math.min(current, numberOfDays - 1));
  }

  function saveTrip() {
    const scheduleError = validateSchedule(trip.days);
    if (scheduleError) {
      setError(scheduleError);
      return;
    }
    setSaving(true);
    setError("");
    const savedPlan = {
      ...trip,
      days: trip.days.map((day, index) => ({
        ...day,
        dayNumber: index + 1,
        activities: day.activities.map((activity, order) => ({ ...activity, order })),
      })),
      savedAt: new Date().toISOString(),
    };
    onSavePlan(savedPlan);
    setTrip(savedPlan);
    setNotice("Trip saved successfully.");
    setSaving(false);
    navigate("/#saved-plan");
  }

  if (!trip) return <main className="page-shell"><ErrorMessage>This trip draft is no longer available in this session. Start a new trip from a destination.</ErrorMessage><Link className="text-button" to="/">Back to destinations</Link></main>;

  const destination = trip.destinationId;
  const selectedHotelId = getId(trip.hotelId) || "";

  return (
    <main className="trip-page page-shell">
      <Link className="back-link" to={`/destination/${getId(destination)}`}>← Back to {destination.name}</Link>
      <section className="trip-header">
        <div>
          <span className="eyebrow">YOUR TRIP / {destination.country}</span>
          <h1>{destination.name}<br /><em>your way.</em></h1>
          <p>{destination.description}</p>
        </div>
        <Photo src={destination.image} alt={destination.name} type="destination" loading="eager" credit={destination.imageCredit} license={destination.imageLicense} licenseUrl={destination.imageLicenseUrl} sourceUrl={destination.imageSourceUrl} />
      </section>

      <div className="trip-toolbar">
        <label>Trip days<input type="number" min="1" step="1" value={trip.numberOfDays} onChange={(event) => changeDayCount(event.target.value)} /></label>
        <label>Start date<input type="date" value={trip.startDate ? new Date(trip.startDate).toISOString().slice(0, 10) : ""} onChange={(event) => updateTrip({ startDate: event.target.value || null })} /></label>
        <label className="hotel-select">Stay<select value={selectedHotelId} onChange={(event) => updateTrip({ hotelId: hotels.find((hotel) => hotel._id === event.target.value) || null })}><option value="">No hotel selected</option>{hotels.map((hotel) => <option value={hotel._id} key={hotel._id}>{hotel.name} · {formatPrice(hotel.priceRange.min)} / night</option>)}</select></label>
        <button className="button button-coral save-button" type="button" disabled={saving} onClick={saveTrip}>{saving ? "Saving..." : "Save trip"}</button>
      </div>
      <ErrorMessage>{error}</ErrorMessage>
      {notice && <p className={notice === "Trip saved successfully." ? "save-notice" : "edit-notice"} role="status">{notice}</p>}

      <section className="trip-layout">
        <div className="itinerary-column">
          <div className="section-heading"><div><span className="eyebrow">THE PLAN</span><h2>Your itinerary</h2></div><span className="section-note">{trip.days.reduce((count, day) => count + day.activities.length, 0)} activities</span></div>
          {trip.days.map((day, dayIndex) => <TripDay key={day.dayNumber} day={day} dayIndex={dayIndex} numberOfDays={trip.numberOfDays} onRemove={removeActivity} onMove={moveActivity} onReorder={reorderActivity} onTimeChange={changeActivityTime} />)}
        </div>

        <aside className="add-activities">
          <span className="eyebrow">ADD TO YOUR PLAN</span>
          <h2>Pick a place</h2>
          <label>Add to day<select value={targetDay} onChange={(event) => setTargetDay(Number(event.target.value))}>{trip.days.map((day, index) => <option key={day.dayNumber} value={index}>Day {day.dayNumber}</option>)}</select></label>
          <h3>Things to see</h3>
          {spots.length === 0 ? <EmptyMessage>No tourist spots yet.</EmptyMessage> : <ul className="add-list">{spots.map((spot) => <li key={spot._id}><Photo className="add-list-photo" src={spot.image} type="spot" alt={spot.name} /><span>{spot.name}<small>{spot.duration || "Sightseeing"}</small></span><button type="button" className="add-button" aria-label={`Add ${spot.name}`} onClick={() => addActivity("spot", spot)}>+</button></li>)}</ul>}
          <h3>Places to eat</h3>
          {restaurants.length === 0 ? <EmptyMessage>No restaurants yet.</EmptyMessage> : <ul className="add-list">{restaurants.map((restaurant) => <li key={restaurant._id}><Photo className="add-list-photo" src={restaurant.image} type="restaurant" alt={restaurant.name} /><span>{restaurant.name}<small>{restaurant.cuisine}</small></span><button type="button" className="add-button" aria-label={`Add ${restaurant.name}`} onClick={() => addActivity("restaurant", restaurant)}>+</button></li>)}</ul>}
        </aside>
      </section>
      {trip.days.every((day) => day.activities.length === 0) && <EmptyMessage>Your itinerary is empty. Add a place to begin.</EmptyMessage>}
    </main>
  );
}