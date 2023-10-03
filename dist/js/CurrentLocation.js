export default class CUrrentLocation {
    constructor() {
        this._name = "Current Location"
        this._lat = null
        this._lon = null
        this._unit = "imperial"
    }

    // getter and setter for the private variables

    setName(name) {
        this._name = name
    }
    getName() {
        return this._name
    }


    setLat(lat) {
        this._lat = lat
    }
    getLat() {
        return this._lat
    }


    setLon(lon) {
        this._lon = lon
    }
    getLon() {
        return this._lon
    }


    setUnit(unit) {
        this._unit = unit
    }
    getUnit() {
        return this._unit
    }

    toggleUnit() {
        this._unit = this._unit === "imperial" ? "metric" : "imperial"
    }
}