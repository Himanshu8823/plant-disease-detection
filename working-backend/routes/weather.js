const express = require('express');
const { query, validationResult } = require('express-validator');
const axios = require('axios');

const router = express.Router();

// Get current weather
router.get('/current', [
  query('lat').isFloat({ min: -90, max: 90 }),
  query('lon').isFloat({ min: -180, max: 180 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { lat, lon } = req.query;

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
    );

    const weatherData = response.data;
    const agriculturalInsights = getAgriculturalInsights(weatherData);

    res.json({
      success: true,
      data: {
        current: {
          temperature: weatherData.main.temp,
          feels_like: weatherData.main.feels_like,
          humidity: weatherData.main.humidity,
          pressure: weatherData.main.pressure,
          wind_speed: weatherData.wind.speed,
          wind_direction: weatherData.wind.deg,
          description: weatherData.weather[0].description,
          icon: weatherData.weather[0].icon,
          visibility: weatherData.visibility,
          clouds: weatherData.clouds.all
        },
        location: {
          name: weatherData.name,
          country: weatherData.sys.country,
          coordinates: {
            lat: weatherData.coord.lat,
            lon: weatherData.coord.lon
          }
        },
        agricultural_insights: agriculturalInsights,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Weather API error:', error);
    
    if (error.response?.status === 401) {
      return res.status(401).json({
        success: false,
        message: 'Invalid OpenWeatherMap API key'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to fetch weather data',
      error: error.message
    });
  }
});

// Get weather forecast
router.get('/forecast', [
  query('lat').isFloat({ min: -90, max: 90 }),
  query('lon').isFloat({ min: -180, max: 180 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { lat, lon } = req.query;

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
    );

    const forecastData = response.data;
    const dailyForecast = processForecastData(forecastData.list);
    const agriculturalRecommendations = getAgriculturalRecommendations(dailyForecast);

    res.json({
      success: true,
      data: {
        location: {
          name: forecastData.city.name,
          country: forecastData.city.country,
          coordinates: {
            lat: forecastData.city.coord.lat,
            lon: forecastData.city.coord.lon
          }
        },
        forecast: dailyForecast,
        agricultural_recommendations: agriculturalRecommendations,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Forecast API error:', error);
    
    if (error.response?.status === 401) {
      return res.status(401).json({
        success: false,
        message: 'Invalid OpenWeatherMap API key'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to fetch forecast data',
      error: error.message
    });
  }
});

// Helper function to get agricultural insights from current weather
const getAgriculturalInsights = (weatherData) => {
  const temp = weatherData.main.temp;
  const humidity = weatherData.main.humidity;
  const windSpeed = weatherData.wind.speed;
  const description = weatherData.weather[0].description.toLowerCase();

  const insights = {
    risk_level: 'low',
    recommendations: [],
    plant_health: 'good',
    irrigation_needed: false,
    pest_risk: 'low'
  };

  // Temperature-based insights
  if (temp < 5) {
    insights.risk_level = 'high';
    insights.recommendations.push('Protect sensitive plants from frost');
    insights.plant_health = 'at_risk';
  } else if (temp > 35) {
    insights.risk_level = 'high';
    insights.recommendations.push('Provide shade and extra watering');
    insights.plant_health = 'stressed';
  } else if (temp > 25) {
    insights.risk_level = 'medium';
    insights.recommendations.push('Monitor for heat stress');
  }

  // Humidity-based insights
  if (humidity > 80) {
    insights.pest_risk = 'high';
    insights.recommendations.push('High humidity - watch for fungal diseases');
  } else if (humidity < 30) {
    insights.irrigation_needed = true;
    insights.recommendations.push('Low humidity - increase watering frequency');
  }

  // Wind-based insights
  if (windSpeed > 20) {
    insights.risk_level = 'medium';
    insights.recommendations.push('Strong winds - protect tall plants');
  }

  // Weather condition insights
  if (description.includes('rain')) {
    insights.irrigation_needed = false;
    insights.recommendations.push('Natural irrigation from rain');
  } else if (description.includes('snow')) {
    insights.risk_level = 'high';
    insights.recommendations.push('Protect plants from snow damage');
  }

  return insights;
};

// Helper function to process forecast data into daily format
const processForecastData = (forecastList) => {
  const dailyData = {};
  
  forecastList.forEach(item => {
    const date = new Date(item.dt * 1000).toDateString();
    
    if (!dailyData[date]) {
      dailyData[date] = {
        date: date,
        temp_min: item.main.temp_min,
        temp_max: item.main.temp_max,
        humidity: item.main.humidity,
        wind_speed: item.wind.speed,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        rain_probability: item.pop * 100
      };
    } else {
      // Update with more extreme values
      dailyData[date].temp_min = Math.min(dailyData[date].temp_min, item.main.temp_min);
      dailyData[date].temp_max = Math.max(dailyData[date].temp_max, item.main.temp_max);
      dailyData[date].rain_probability = Math.max(dailyData[date].rain_probability, item.pop * 100);
    }
  });

  return Object.values(dailyData).slice(0, 5); // Return 5-day forecast
};

// Helper function to get agricultural recommendations from forecast
const getAgriculturalRecommendations = (forecast) => {
  const recommendations = {
    irrigation_planning: [],
    pest_management: [],
    crop_protection: [],
    general_advice: []
  };

  forecast.forEach(day => {
    const temp = (day.temp_min + day.temp_max) / 2;
    const humidity = day.humidity;
    const rainProb = day.rain_probability;

    // Irrigation planning
    if (rainProb < 30 && humidity < 50) {
      recommendations.irrigation_planning.push(`${day.date}: Plan for irrigation due to low humidity and low rain probability`);
    }

    // Pest management
    if (humidity > 75) {
      recommendations.pest_management.push(`${day.date}: Monitor for fungal diseases due to high humidity`);
    }

    // Crop protection
    if (day.temp_min < 5) {
      recommendations.crop_protection.push(`${day.date}: Protect sensitive crops from low temperatures`);
    } else if (day.temp_max > 30) {
      recommendations.crop_protection.push(`${day.date}: Provide shade for heat-sensitive plants`);
    }

    // General advice
    if (rainProb > 70) {
      recommendations.general_advice.push(`${day.date}: Good day for natural irrigation, reduce manual watering`);
    }
  });

  return recommendations;
};

module.exports = router;