const weatherService = require('../services/weatherService');
const Weather = require('../models/weather');

class WeatherController {
    async getCurrentWeather(req, res) {
        try {
            const { city } = req.params;
            console.log('İstek yapılan şehir:', city);

            const weatherData = await weatherService.getWeather(city);
            console.log('Alınan hava durumu verisi:', weatherData);

            const weather = new Weather(weatherData);
            const forecast = await weatherService.getForecast(city);

            res.json({
                current: weather.getFormattedData(),
                forecast: forecast.list
            });
        } catch (error) {
            console.error('Kontroller Hatası:', error);
            res.status(500).json({
                error: error.message,
                details: 'Hava durumu bilgisi alınamadı'
            });
        }
    }

    async renderHomePage(req, res) {
        try {
            const defaultWeather = await weatherService.getWeather('Istanbul');
            const weather = new Weather(defaultWeather);
            res.render('index', weather.getFormattedData());
        } catch (error) {
            console.error('Ana sayfa hatası:', error);
            res.render('index', {
                error: 'Hava durumu bilgisi alınamadı'
            });
        }
    }
}

module.exports = new WeatherController();
