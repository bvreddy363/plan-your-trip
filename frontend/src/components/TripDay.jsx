import { getId } from "../api/client";
import { EmptyMessage } from "./Feedback";
import Photo from "./Photo";

function getDuration(startTime, endTime) {
  if (!startTime || !endTime) return "Time required";
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);
  const totalMinutes = endHour * 60 + endMinute - startHour * 60 - startMinute;
  if (totalMinutes <= 0) return "End must be later";
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return [hours ? `${hours}h` : "", minutes ? `${minutes}m` : ""].filter(Boolean).join(" ");
}

export default function TripDay({ day, dayIndex, numberOfDays, onRemove, onMove, onReorder, onTimeChange }) {
  return (
    <section className="trip-day">
      <div className="trip-day-heading">
        <span className="day-number">{String(day.dayNumber).padStart(2, "0")}</span>
        <div>
          <span className="eyebrow">ITINERARY</span>
          <h3>Day {day.dayNumber}</h3>
        </div>
      </div>
      {day.activities.length === 0 ? <EmptyMessage>Nothing planned yet.</EmptyMessage> : (
        <ol className="activity-list">
          {day.activities.map((activity, activityIndex) => {
            const item = activity.kind === "spot" ? activity.spotId : activity.restaurantId;
            const itemId = getId(item);
            return (
              <li className="activity-row" key={`${activity.kind}-${itemId}`}>
                <span className="activity-order">{String(activityIndex + 1).padStart(2, "0")}</span>
                <Photo className="activity-photo" src={item?.image} type={activity.kind === "spot" ? "spot" : "restaurant"} alt={item?.name || "Planned activity"} credit={item?.imageCredit} license={item?.imageLicense} licenseUrl={item?.imageLicenseUrl} sourceUrl={item?.imageSourceUrl} />
                <div className="activity-title">
                  <strong>{item?.name || (activity.kind === "spot" ? "Tourist spot" : "Restaurant")}</strong>
                  <span>{activity.kind === "spot" ? "Sightseeing" : item?.cuisine || "Restaurant"}</span>
                </div>
                <div className="activity-time-fields">
                  <label>
                    <span>Start</span>
                    <input
                      type="time"
                      required
                      value={activity.startTime || ""}
                      aria-label={`Start time for ${item?.name || "activity"}`}
                      onChange={(event) => onTimeChange(dayIndex, activityIndex, "startTime", event.target.value)}
                    />
                  </label>
                  <label>
                    <span>End</span>
                    <input
                      type="time"
                      required
                      value={activity.endTime || ""}
                      aria-label={`End time for ${item?.name || "activity"}`}
                      onChange={(event) => onTimeChange(dayIndex, activityIndex, "endTime", event.target.value)}
                    />
                  </label>
                  <span className="activity-duration">{getDuration(activity.startTime, activity.endTime)}</span>
                </div>
                <label className="visually-hidden" htmlFor={`move-${day.dayNumber}-${activityIndex}`}>Move activity to another day</label>
                <select
                  id={`move-${day.dayNumber}-${activityIndex}`}
                  value={dayIndex}
                  onChange={(event) => onMove(dayIndex, activityIndex, Number(event.target.value))}
                  aria-label={`Move ${item?.name || "activity"} to another day`}
                >
                  {Array.from({ length: numberOfDays }, (_, index) => (
                    <option key={index} value={index}>Day {index + 1}</option>
                  ))}
                </select>
                <div className="activity-actions">
                  <button type="button" className="icon-button" aria-label="Move up" title="Move up" disabled={activityIndex === 0} onClick={() => onReorder(dayIndex, activityIndex, -1)}>↑</button>
                  <button type="button" className="icon-button" aria-label="Move down" title="Move down" disabled={activityIndex === day.activities.length - 1} onClick={() => onReorder(dayIndex, activityIndex, 1)}>↓</button>
                  <button type="button" className="text-button remove-button" onClick={() => onRemove(dayIndex, activityIndex)}>Remove</button>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}