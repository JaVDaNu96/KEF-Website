const fs = require('fs');
const path = require('path');

exports.handler = async () => {
    try {
        const filePath = path.join(__dirname, '../../data/intervenciones.json');
        if (!fs.existsSync(filePath)) {
            console.error("JSON file not found at:", filePath);
            return { statusCode: 500, body: JSON.stringify({ error: "JSON file not found" }) };
        }

        const data = fs.readFileSync(filePath, 'utf8');
        const interventions = JSON.parse(data);

        return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(interventions) };
    } catch (error) {
        console.error("Error loading JSON:", error);
        return { statusCode: 500, body: JSON.stringify({ error: 'Failed to load interventions' }) };
    }
};

