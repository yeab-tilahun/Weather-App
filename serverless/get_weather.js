const fetch = require("node-fetch")

const { WEATHER_API_KEY } = process.env //netlify will provide the key

exports.handler = async (event, context) => {
    const params = JSON.parse(event.body)
    const { lat, lon, units } = params
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&minutely,hourly,alerts&units=${units}&appid=${WEATHER_API_KEY}`
    try {
        const weatherStreame = await fetch(url)
        const weatherJson = await weatherStreame.json()
        return {
            statusCode: 200,
            body: JSON.stringify(weatherJson)
        }
    } catch (error) {
        return {
            statusCode: 422,
            body: error.stack
        }
    }
}