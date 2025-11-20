import React from "react";
import "../../styles/TutorProfile/AvailabilityCard.css";

const AvailabilityCard = ({ profile }) => {
  if (!profile.availability || profile.availability.length === 0)
    return null;

  return (
    <div className="availability-card">
      <h3 className="availability-title">Availability</h3>
      <div className="availability-table-wrapper">
        <table className="availability-table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Start</th>
              <th>End</th>
            </tr>
          </thead>
          <tbody>
            {profile.availability.map((slot, idx) => (
              <tr key={idx}>
                <td>{slot.day}</td>
                <td>{slot.startTime}</td>
                <td>{slot.endTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AvailabilityCard;
