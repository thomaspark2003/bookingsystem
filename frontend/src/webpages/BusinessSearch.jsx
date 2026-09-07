import { useState } from "react";
import { searchBusinesses } from "../services/api";

function BusinessSearch({ onSelect }) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [searched, setSearched] = useState(false);

    async function handleSearch(e) {
        e.preventDefault();
        const matches = await searchBusinesses(query);
        setResults(matches);
        setSearched(true);
    }

    return (
        <div>
            <h2>Find a business</h2>
            <form onSubmit={handleSearch} className="field" style={{ display: "flex", gap: "0.5rem" }}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Business name"
                />
                <button type="submit">Search</button>
            </form>

            {searched && results.length === 0 && (
                <p className="empty-note">No businesses found matching "{query}".</p>
            )}

            {results.map((business) => (
                <div key={business.id} className="resource-row">
                    <div className="resource-header">
                        <h2>{business.name}</h2>
                        <button onClick={() => onSelect(business)}>View listings</button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default BusinessSearch;