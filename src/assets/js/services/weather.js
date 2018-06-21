async function getWeather(location) {
  const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${location},cl&appid=5f0011af63d779a94651eea0f1e25e2c`);
  return response.json();
}

export default {
  getWeather,
};

