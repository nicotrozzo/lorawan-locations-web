// Importing required node modules
const express = require('express');
const path = require('path');

// Importing server configuration
const config = {
    server: {
        port: process.env.PORT || 5000
    }
};

// Importing locations
const { getSafeZone, isValidZone } = require('./loc_server/locations');

// Global variables
let app;

// Initializing the server
(async() => {

    // Creates the express app
    app = express();

    // Logging requests
    app.use((req, res, next) => {
        console.log(`[Server] HTTP - ${req.method} - ${req.path}`);
        next();
    });

    // Get Safe Zone Endpoint
    app.get('/api/safe_zone', (req, res) => {
        let zone = req.query.zone; 
        if ((zone !== undefined) && isValidZone(zone))
        {
            res.send(getSafeZone(zone));
        }
        else
        {
            res.status(400).send({
                message: "Provide a valid safe zone"
            });
        }
    });
    
    app.use(express.static(__dirname + '/client'));

    // Serve index.html for default route
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '/client/index.html'));
    });

    app.listen(config.server.port, () => {
        // Console message
        console.log(`[Server] The server is listening to port ${config.server.port}`);
    });

})();
