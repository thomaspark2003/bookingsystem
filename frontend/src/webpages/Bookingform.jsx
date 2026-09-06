import { useState } from "react";
import { createBooking } from "../services/api";

import { getCurrentUserId } from "../services/user";

const FAKE_USER_ID = getCurrentUserId();

function BookingForm({ resource, onClose, onBooked }) {
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [partySize, setPartySize] = useState(1);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);

        const startDate = new Date(start);
        const endDate = new Date(end);

        if (startDate.toDateString() !== endDate.toDateString()) {
            setError("Start and end must be on the same day.");
            return;
        }

        setSubmitting(true);

        const booking = {
            resource: resource.id,
            user_id: FAKE_USER_ID,
            during: JSON.stringify({
                lower: startDate.toISOString(),
                upper: endDate.toISOString(),
            }),
            party_size: Number(partySize),
        };

        try {
            await createBooking(booking);
            onBooked();
            onClose();
        } catch (err) {
            setError(err.message || "Something went wrong");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form className="booking-form" onSubmit={handleSubmit}>
            <div className="field">
                <label>Start</label>
                <input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} required />
            </div>
            <div className="field">
                <label>End</label>
                <input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} required />
            </div>
            <div className="field">
                <label>Party size</label>
                <input type="number" min="1" value={partySize} onChange={(e) => setPartySize(e.target.value)} />
            </div>

            {error && <p className="error-text">{error}</p>}

            <div className="form-actions">
                <button type="submit" disabled={submitting}>
                    {submitting ? "Booking..." : "Confirm booking"}
                </button>
                <button type="button" className="secondary" onClick={onClose}>Cancel</button>
            </div>
        </form>
    );
}

export default BookingForm;