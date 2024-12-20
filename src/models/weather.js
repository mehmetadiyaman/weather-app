class Weather {
    constructor(weatherData) {
        this.temperature = weatherData.main.temp;
        this.description = weatherData.weather[0].description;
        this.humidity = weatherData.main.humidity;
        this.windSpeed = weatherData.wind.speed;
        this.city = weatherData.name;
        this.country = weatherData.sys.country;
        this.icon = weatherData.weather[0].icon;
        this.feels_like = weatherData.main.feels_like;
        this.pressure = weatherData.main.pressure;
    }

    getFormattedData() {
        return {
            temperature: Math.round(this.temperature),
            description: this.description,
            humidity: this.humidity,
            windSpeed: this.windSpeed,
            city: this.city,
            country: this.country,
            icon: `http://openweathermap.org/img/wn/${this.icon}@2x.png`,
            feels_like: Math.round(this.feels_like),
            pressure: this.pressure
        };
    }
}

module.exports = Weather;