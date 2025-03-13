const fs = require('fs');
const path = require('path');

exports.handler = async () => {
    try {
        // Locate the JSON file inside the Netlify function directory
        const filePath = path.join(__dirname, '../data/intervenciones.json');

        // Read the JSON file (synchronously to ensure data is loaded before response)
        const data = fs.readFileSync(filePath, 'utf8');

        // Parse JSON data
        const interventions = JSON.parse(data);

        // Return JSON response
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(interventions),
        };
    } catch (error) {
        console.error("Error loading interventions:", error);

        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to load interventions' }),
        };
    }
};
