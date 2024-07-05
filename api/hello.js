// api/hello.js
const express = require('express');
const axios = require('axios');
const app = express();

app.get('/api/hello', async (req, res) => {
  const visitorName = req.query.visitor_name || "Visitor";
  const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  try {
    // Use a free geolocation API to get the client's location
    const geoResponse = await axios.get(`https://ipapi.co/${clientIp}/json/`);
    const location = geoResponse.data.city || "Unknown Location";

    // Use a free weather API to get the temperature
    const weatherResponse = await axios.get(`https://api.weatherapi.com/v1/current.json?key=604448afdfc74fb588d145112240207&q=${location}`);
    const temperature = weatherResponse.data.current.temp_c;

    res.json({
      client_ip: clientIp,
      location: location,
      greeting: `Hello, ${visitorName}! The temperature is ${temperature} degrees Celsius in ${location}.`
    });
  } catch (error) {
    res.status(500).send('Error retrieving data');
  }
});

// Export as a Vercel serverless function
module.exports = (req, res) => {
  app(req, res);
};
