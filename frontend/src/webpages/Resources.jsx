import { useEffect, useState } from "react";
import { getResources } from "../services/api";

function Resources() {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadResources() {
            try {
                const data = await getResources();
                setResources(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        loadResources();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>Resources</h1>

            {resources.map((resource) => (
                <div key={resource.id}>
                    <h2>{resource.name}</h2>
                </div>
            ))}
        </div>
    );
}

export default Resources;