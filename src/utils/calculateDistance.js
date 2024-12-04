function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const φ1 = (lat1 * Math.PI) / 180; // Convert degrees to radians
  const φ2 = (lat2 * Math.PI) / 180; // Convert degrees to radians
  const Δφ = ((lat2 - lat1) * Math.PI) / 180; // Difference in latitude in radians
  const Δλ = ((lon2 - lon1) * Math.PI) / 180; // Difference in longitude in radians

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance in kilometers
  return distance;
}

const calculateFare = (x, mode) => {
  let speed = 1;
  if (mode === "express") {
    speed = 1.2;
  }
  const planeDis = Math.floor(x / 500) * 500;
  const truckDis = Math.floor((x % 500) / 100) * 100;
  const vanDis = x - planeDis - truckDis;
  const shippingCharge = planeDis + truckDis * 2 + vanDis * 3;
  return shippingCharge * speed + 10;
};

module.exports = {calculateDistance,calculateFare};
