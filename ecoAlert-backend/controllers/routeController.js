const axios = require("axios");

const DESTINATION = [11.5021, 3.8480]; // Douala fixe (lng, lat)

exports.getRoute = async (req, res) => {
  try {
    const { start, signal } = req.body;

    if (!start) {
      return res.status(400).json({ message: "Start required" });
    }

    const coordinates = [
      [start.lng, start.lat],
      [signal?.lng ?? start.lng, signal?.lat ?? start.lat],
      DESTINATION
    ];

    const response = await axios.post(
      "https://api.openrouteservice.org/v2/directions/driving-car",
      { coordinates },
      {
        headers: {
          Authorization: process.env.ORS_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    const route = response.data.features[0].geometry.coordinates;

    res.json({
      route: route.map(([lng, lat]) => ({ lat, lng }))
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Route error" });
  }
};