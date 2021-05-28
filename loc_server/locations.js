// Load safe zones 'database'
const safe_zones = require('./safe_zones.json');

function isValidZone(zoneName)
{
    return safe_zones[zoneName] !== undefined;
}

function getSafeZone(zoneName)
{
    return safe_zones[zoneName];
}

module.exports = { getSafeZone, isValidZone };