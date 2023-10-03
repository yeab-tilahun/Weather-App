import CurrentLocation from "./CurrentLocation.js";

import {
    addSpinner,
    displayError,
    displayApiError,
    updateScreenReaderConfirmation,
    setPlaceholderText,
    updateDisplay,
} from "./domFunctions.js";

import {
    setLocationObject,
    getHomeLocation,
    cleanText,
    getCoordsFromApi,
    getWeatherFromCoords,
} from "./dataFunctions.js"


const currentLoc = new CurrentLocation()

const initApp = () => {
    // add event listeners for 5 buttons on the page
    const geoButton = document.getElementById("getLocation")
    geoButton.addEventListener("click", getGeoWeather)

    const homeButton = document.getElementById("home")
    homeButton.addEventListener("click", loadWeather)

    const saveButton = document.getElementById("saveLocation")
    saveButton.addEventListener("click", saveLocation)

    const unitButton = document.getElementById("unit")
    unitButton.addEventListener("click", setUnitPref)

    const refreshButton = document.getElementById("refresh")
    refreshButton.addEventListener("click", refreshWeather)

    // search button
    const locationEntry = document.getElementById("searchBar__form")
    locationEntry.addEventListener("submit", submitEventLocation)

    // setup
    setPlaceholderText()

    // load weather
    loadWeather()
}

document.addEventListener("DOMContentLoaded", initApp)


const getGeoWeather = (event) => {
    if (event) {
        if (event.type === "click") {
            // animate icon
            const mapIcon = document.querySelector(".fa-map-marker-alt")
            addSpinner(mapIcon)
        }
    }
    // check if browser doesn't support it
    if (!navigator.geolocation) return geoError()
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError)
}

const geoError = (errObj) => {
    const errMsg = errObj ? errObj.message : "Geolocation not supported"
    displayError(errMsg, errMsg)
}

const geoSuccess = (position) => {
    const myCoordsObj = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        name: `Lat:${position.coords.latitude} Long:${position.coords.longitude}`
    }
    setLocationObject(currentLoc, myCoordsObj)
    updateDataAndDisplay(currentLoc)
}


const loadWeather = (event) => {
    const savedLocation = getHomeLocation()
    if (!savedLocation && !event) return getGeoWeather()
    if (!savedLocation && event.type === "click") {
        displayError(
            "No Home Location Saved.",
            "Sorry. Please save your home location first."
        )
    } else if (savedLocation && !event) {
        displayHomeLocationWeather(savedLocation)
    } else {
        const homeIcon = document.querySelector(".fa-home")
        addSpinner(homeIcon)
        displayHomeLocationWeather(savedLocation)
    }
}

const displayHomeLocationWeather = (home) => {
    if (typeof home === "string") {
        const locationJson = JSON.parse(home)
        const myCoordsObj = {
            lat: locationJson.lat,
            lon: locationJson.lon,
            name: locationJson.name,
            unit: locationJson.unit
        }
        setLocationObject(currentLoc, myCoordsObj)
        updateDataAndDisplay(currentLoc)
    }
}

const saveLocation = () => {
    if (currentLoc.getLat() && currentLoc.getLon()) {
        const saveIcon = document.querySelector(".fa-save")
        addSpinner(saveIcon)
        const location = {
            name: currentLoc.getName(),
            lat: currentLoc.getLat(),
            lon: currentLoc.getLon(),
            unit: currentLoc.getUnit()
        }
        localStorage.setItem("defaultWeatherLocation", JSON.stringify(location))
        updateScreenReaderConfirmation(`Saved ${currentLoc.getName()} as home location.`)

    }
}

const setUnitPref = () => {
    const unitIcon = document.querySelector(".fa-chart-bar")
    addSpinner(unitIcon)
    currentLoc.toggleUnit()
    updateDataAndDisplay(currentLoc)
}

const refreshWeather = () => {
    const refreshIcon = document.querySelector(".fa-sync-alt")
    addSpinner(refreshIcon)
    updateDataAndDisplay(currentLoc)
}


const submitEventLocation = async (event) => {
    event.preventDefault()
    const text = document.getElementById("searchBar__text").value
    const entryText = cleanText(text)
    if (!entryText.length) return

    const locationIcon = document.querySelector(".fa-search")
    addSpinner(locationIcon)

    const coordsData = await getCoordsFromApi(entryText, currentLoc.getUnit())
    if (coordsData) {
        if (coordsData.cod === 200) {
            const myCoordsObj = {
                lat: coordsData.coord.lat,
                lon: coordsData.coord.lon,
                name: coordsData.sys.country
                    ? `${coordsData.name}, ${coordsData.sys.country}`
                    : coordsData.name
            }
            setLocationObject(currentLoc, myCoordsObj)
            updateDataAndDisplay(currentLoc)
        } else {
            displayApiError(coordsData)
        }
    } else {
        displayError("Connection Error", "Connection Error")
    }
}


const updateDataAndDisplay = async (locationObj) => {
    const weatherJson = await getWeatherFromCoords(locationObj)
    console.log(weatherJson)
    if (weatherJson) updateDisplay(weatherJson, locationObj)
}



