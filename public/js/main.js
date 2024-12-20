async function getWeather() {
    const cityInput = document.getElementById('cityInput');
    const city = cityInput.value.trim();
     if (!city) {
        showError('Lütfen bir şehir adı giriniz');
        return;
    }
     try {
        showLoading();
         const response = await fetch(`/api/weather/${city}`);
        const data = await response.json();
         if (!response.ok) {
            throw new Error(data.error || data.details || 'Hava durumu bilgisi alınamadı');
        }
         if (!data.current) {
            throw new Error('Geçersiz API yanıtı');
        }
         updateWeatherUI(data);
        hideLoading();
     } catch (error) {
        console.error('Frontend hatası:', error);
        hideLoading();
        showError(error.message);
    }
}

function updateWeatherUI(data) {
    const { current, forecast } = data;
     document.getElementById('cityName').textContent = `${current.city}, ${current.country}`;
    document.getElementById('temperature').textContent = current.temperature;
    document.getElementById('description').textContent = current.description;
    document.getElementById('humidity').textContent = current.humidity;
    document.getElementById('windSpeed').textContent = current.windSpeed;
     const weatherIcon = document.querySelector('.weather-icon');
    weatherIcon.src = current.icon;
     updateTemperatureChart(forecast);
    updateHumidityPressureChart(forecast);
    updateWindChart(forecast);
}

function updateTemperatureChart(forecast) {
    const ctx = document.getElementById('temperatureChart').getContext('2d');
    const dailyData = processDailyForecasts(forecast);
     new Chart(ctx, {
        type: 'line',
        data: {
            labels: dailyData.map(day => day.date),
            datasets: [{
                label: 'Sıcaklık (°C)',
                data: dailyData.map(day => day.temp),
                borderColor: '#FF6384',
                backgroundColor: 'rgba(255, 99, 132, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            animations: {
                tension: {
                    duration: 1000,
                    easing: 'linear'
                }
            },
            plugins: {
                legend: { position: 'top' }
            }
        }
    });
}

function updateHumidityPressureChart(forecast) {
    const ctx = document.getElementById('humidityPressureChart').getContext('2d');
    const data = forecast.slice(0, 8); // İlk 24 saat
     new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(item => new Date(item.dt * 1000).toLocaleTimeString('tr-TR', { hour: '2-digit' })),
            datasets: [
                {
                    label: 'Nem (%)',
                    data: data.map(item => item.main.humidity),
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    yAxisID: 'y'
                },
                {
                    label: 'Basınç (hPa)',
                    data: data.map(item => item.main.pressure),
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            animation: {
                duration: 2000
            },
            scales: {
                y: {
                    type: 'linear',
                    position: 'left',
                    title: { display: true, text: 'Nem (%)' }
                },
                y1: {
                    type: 'linear',
                    position: 'right',
                    title: { display: true, text: 'Basınç (hPa)' },
                    grid: { drawOnChartArea: false }
                }
            }
        }
    });
}

function updateWindChart(forecast) {
    const ctx = document.getElementById('windChart').getContext('2d');
    const data = forecast.slice(0, 8); // İlk 24 saat
     new Chart(ctx, {
        type: 'radar',
        data: {
            labels: data.map(item => new Date(item.dt * 1000).toLocaleTimeString('tr-TR', { hour: '2-digit' })),
            datasets: [{
                label: 'Rüzgar Hızı (km/s)',
                data: data.map(item => item.wind.speed),
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                pointBackgroundColor: 'rgba(153, 102, 255, 1)',
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            animation: {
                duration: 1500
            },
            scales: {
                r: {
                    beginAtZero: true,
                    ticks: { stepSize: 5 }
                }
            }
        }
    });
}

function processDailyForecasts(forecastData) {
    const dailyForecasts = [];
    const dailyMap = new Map();
     forecastData.forEach(forecast => {
        const date = forecast.dt_txt.split(' ')[0];
        if (!dailyMap.has(date)) {
            dailyMap.set(date, {
                temps: [],
                date: new Date(date).toLocaleDateString('tr-TR', { weekday: 'short' })
            });
        }
        dailyMap.get(date).temps.push(forecast.main.temp);
    });
     dailyMap.forEach((value, key) => {
        const avgTemp = value.temps.reduce((a, b) => a + b, 0) / value.temps.length;
        dailyForecasts.push({
            date: value.date,
            temp: Math.round(avgTemp)
        });
    });
     return dailyForecasts.slice(0, 5);
}

function showLoading() {
    const weatherInfo = document.getElementById('weatherInfo');
    weatherInfo.style.opacity = '0.5';
    
    const loader = document.createElement('div');
    loader.id = 'loader';
    loader.className = 'loader';
    document.body.appendChild(loader);
}

function hideLoading() {
    const weatherInfo = document.getElementById('weatherInfo');
    weatherInfo.style.opacity = '1';
    
    const loader = document.getElementById('loader');
    if (loader) {
        loader.remove();
    }
}

function showError(message) {
    const weatherInfo = document.getElementById('weatherInfo');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
     const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
     weatherInfo.parentNode.insertBefore(errorDiv, weatherInfo);
     setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

document.getElementById('cityInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getWeather();
    }
  });