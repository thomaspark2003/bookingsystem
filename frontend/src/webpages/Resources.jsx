import { useEffect, useState } from "react";
import { getResources, getBookings, updateBooking } from "../services/api";
import { getCurrentUserId } from "../services/user";
import BookingForm from "./Bookingform";

function Resources() {
    const [resources, setResources] = useState([]);
    const [bookingsByResource, setBookingsByResource] = useState({});
    const [loading, setLoading] = useState(true);
    const [bookingResource, setBookingResource] = useState(null);
    const [message, setMessage] = useState(null);

    const currentUserId = getCurrentUserId();

    async function loadAll() {
        try {
            const resourceData = await getResources();
            setResources(resourceData);

            const entries = await Promise.all(
                resourceData.map(async (r) => [r.id, await getBookings(r.id)])
            );
            setBookingsByResource(Object.fromEntries(entries));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadAll();
    }, []);

    async function handleCancelBooking(id) {
        await updateBooking(id, { status: "cancelled" });
        loadAll();
    }

    if (loading) {
        return <p className="subtitle">Loading resources...</p>;
    }

    return (
        <div>
            {message && <div className="confirmation-banner">{message}</div>}

            {resources.map((resource) => {
                const bookings = bookingsByResource[resource.id] || [];
                const activeBookings = bookings.filter((b) => b.status === "confirmed");
                const isBookingThis = bookingResource?.id === resource.id;

                return (
                    <div className="resource-row" key={resource.id}>
                        <div className="resource-header">
                            <h2>{resource.name}</h2>
                            <button
                                className={isBookingThis ? "secondary" : ""}
                                onClick={() => setBookingResource(isBookingThis ? null : resource)}
                            >
                                {isBookingThis ? "Cancel" : "Book"}
                            </button>
                        </div>

                        {activeBookings.length > 0 ? (
                            <ul className="booking-list">
                                {activeBookings.map((b) => {
                                    const during = JSON.parse(b.during);
                                    const isOwnBooking = b.user_id === currentUserId;
                                    return (
                                        <li key={b.id}>
                                            {new Date(during.lower).toLocaleString()} → {new Date(during.upper).toLocaleTimeString()}
                                            {isOwnBooking && (
                                                <button
                                                    className="secondary"
                                                    onClick={() => handleCancelBooking(b.id)}
                                                    style={{ marginLeft: "0.75rem" }}
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <p className="empty-note">No bookings yet</p>
                        )}

                        {isBookingThis && (
                            <BookingForm
                                resource={resource}
                                onClose={() => setBookingResource(null)}
                                onBooked={() => {
                                    setMessage(`Booked ${resource.name}.`);
                                    loadAll();
                                }}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default Resources;