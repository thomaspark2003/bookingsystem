const API_URL = "http://localhost:8000/api";

export async function getResources() {
    const response = await fetch(`${API_URL}/resources/`);

    if (!response.ok) {
        throw new Error("Failed to fetch resources");
    }

    return response.json();
}

export async function getBookings(resourceId) {
    const url = resourceId
        ? `${API_URL}/bookings/?resource=${resourceId}`
        : `${API_URL}/bookings/`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Failed to fetch bookings");
    }

    return response.json();
}
export async function createBooking(booking) {
    const response = await fetch(`${API_URL}/bookings/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(booking),
    });

    if (!response.ok) {
        throw new Error("Failed to create booking");
    }

    return response.json();
}