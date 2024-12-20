const axios = require('axios');
const config = require('../config/config');

class WeatherService {
    constructor() {
        this.apiKey = config.openWeather.apiKey;
        this.baseUrl = config.openWeather.baseUrl;
    }

    async getWeather(city) {
        try {
            if (!this.apiKey) {
                throw new Error('API anahtarı bulunamadı');
            }

            const response = await axios.get(`${this.baseUrl}/weather`, {
                params: {
                    q: city,
                    appid: this.apiKey,
                    units: 'metric',
                    lang: 'tr'
                }
            });
            return response.data;
        } catch (error) {
            console.error('API Hata Detayı:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            throw error;
        }
    }

    async getForecast(city) {
        try {
            const response = await axios.get(`${this.baseUrl}/forecast`, {
                params: {
                    q: city,
                    appid: this.apiKey,
                    units: 'metric',
                    lang: 'tr'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Tahmin Hatası:', error);
            throw new Error('Hava tahmini alınamadı');
        }
    }
}

module.exports = new WeatherService();