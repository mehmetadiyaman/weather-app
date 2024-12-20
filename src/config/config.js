require('dotenv').config();

if (!process.env.OPENWEATHER_API_KEY) {
    console.error('OPENWEATHER_API_KEY bulunamadı!');
    process.exit(1);
}

module.exports = {
    openWeather: {
        apiKey: process.env.OPENWEATHER_API_KEY,
        baseUrl: 'https://api.openweathermap.org/data/2.5'
    },
    port: process.env.PORT || 3000
};

