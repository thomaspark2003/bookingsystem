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

export async function updateBooking(id, data) {
    const response = await fetch(`${API_URL}/bookings/${id}/`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Failed to update booking");
    }

    return response.json();
}

export async function createResource(resource) {
    const response = await fetch(`${API_URL}/resources/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resource),
    });

    if (!response.ok) {
        throw new Error("Failed to create resource");
    }

    return response.json();
}

export async function deleteResource(id) {
    const response = await fetch(`${API_URL}/resources/${id}/`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Failed to delete resource");
    }
}

export async function searchBusinesses(name) {
    const response = await fetch(`${API_URL}/businesses/?name=${encodeURIComponent(name)}`);
    if (!response.ok) {
        throw new Error("Failed to search businesses");
    }
    return response.json();
}

export async function createBusiness(business) {
    const response = await fetch(`${API_URL}/businesses/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(business),
    });
    if (!response.ok) {
        throw new Error("Failed to create business");
    }
    return response.json();
}