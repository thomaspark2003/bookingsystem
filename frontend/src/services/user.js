
export function getCurrentUserId() {
    let id = localStorage.getItem("fakeUserId");
    if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem("fakeUserId", id);
    }
    return id;
}