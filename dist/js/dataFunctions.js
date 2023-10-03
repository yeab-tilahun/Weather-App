const WEATHER_API_KEY = "0c1943c27245bdeb33c0706fba22362e"
export const setLocationObject = (locationObject, coordsObj) => {
    const { lat, lon, name, unit } = coordsObj
    locationObject.setLat(lat)
    locationObject.setLon(lon)
    locationObject.setName(name)
    if (unit) {
        locationObject.setUnit(unit)
    }
}

export const getHomeLocation = () => {
    return localStorage.getItem("defaultWeatherLocation")
}

export const getWeatherFromCoords = async (locationObj) => {
    const lat = locationObj.getLat()
    const lon = locationObj.getLon()
    const units = locationObj.getUnit()
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&minutely,hourly,alerts&units=${units}&appid=${WEATHER_API_KEY}`
    try {
        const weatherStreame = await fetch(url)
        const weatherJson = await weatherStreame.json()
        // console.log(weatherJson)
        return weatherJson
    } catch (error) {
        console.log(error.stack)
    }
}

export const getCoordsFromApi = async (entryText, units) => {
    const regex = /^\d+$/g
    const flag = regex.test(entryText) ? "zip" : "q"
    const url = `https://api.openweathermap.org/data/2.5/weather?${flag}=
    ${entryText}&units=${units}&appid=${WEATHER_API_KEY}`
    const encodeUrl = encodeURI(url)
    try {
        const dataStreame = await fetch(encodeUrl)
        const jsonData = await dataStreame.json()
        // console.log(jsonData)
        return jsonData
    } catch (error) {
        console.log(error.stack)
    }
}

export const cleanText = (text) => {
    const regex = / {2,}/g
    const entryText = text.replaceAll(regex, " ").trim()
    return entryText
}