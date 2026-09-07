import { useState } from "react";
import { createResource } from "../services/api";

function AddResourceForm({ onClose, onCreated }) {
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        try {
            await createResource({ name, type });
            onCreated();
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
                <label>Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Conference Room A"
                    required
                />
            </div>
            <div className="field">
                <label>Type</label>
                <input
                    type="text"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    placeholder="e.g. room, event, appointment"
                    required
                />
            </div>

            {error && <p className="error-text">{error}</p>}

            <div className="form-actions">
                <button type="submit" disabled={submitting}>
                    {submitting ? "Adding..." : "Add"}
                </button>
                <button type="button" className="secondary" onClick={onClose}>Cancel</button>
            </div>
        </form>
    );
}

export default AddResourceForm;