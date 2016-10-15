import {Injectable} from "@angular/core";

@Injectable()
export class StuttgartMapsCoordinatesCalculator {

  /**
   * Defines how many coordinate points equals to one degree in geolocaion scale
   * @type {number}
   */
  private oneDegreePoints: Number = 31304.248840319872506331995788156;

  /**
   * Defines how many dregrees equals to one point in coordinates
   * @type {number}
   */
  private onePointDegrees: Number = (0.0035139 / 110);

  /**
   * Geolocation of Stuttgart Schlossplatz
   * @type {{lat: number; lng: number}}
   */
  private schlossplatzGeolocation: Object = {
    'lat': 48.77855146,
    'lng': 9.17984426
  }

  /**
   * Point coordinates of Stuttgart Schlossplatz
   * @type {{x: number; y: number}}
   */
  private schlossplatzCoordinates: Object = {
    'x': 3513294,
    'y': 5404578
  }

  /**
   * Constructor method
   */
  constructor() {}

  /**
   * TODO: Method converts coords to geolocation
   * @param coords
   * @type {{lat: number, lng: number}}
   */
  convertCoordsToGeolocation(coords: Object): Object {

    // Calculate delta between fix point and given coordinates
    let deltaX: Number = coords['x'] - this.schlossplatzCoordinates['x'];
    let deltaY: Number = coords['y'] - this.schlossplatzCoordinates['y'];

    // Calculate delta lat-lng degrees
    let deltaLat: Number = deltaX * this.onePointDegrees;
    let deltaLng: Number = deltaY * this.onePointDegrees;

    // Calculate lat-lng geocoordinates
    let lat: Number = this.schlossplatzGeolocation['lat'] + deltaLat;
    let lng: Number = this.schlossplatzGeolocation['lng'] + deltaLng;

    // return converted lat and lng coordinates
    return {'lat': lat, 'lng': lng};
  }

  /**
   * Method converts geolocation to coords
   * @param geolocation
   * @type {{x: Number, y: Number}}
   */
  convertGeolocationToCoords(geolocation: Object): Object {

    // Calculate delta lat lng between fix point and given geolocation
    let deltaLat: Number = this.schlossplatzGeolocation['lat'] - geolocation['lat'];
    let deltaLng: Number = this.schlossplatzGeolocation['lng'] - geolocation['lng'];

    // Calculate delta coords points
    let deltaX: Number = deltaLat * this.oneDegreePoints;
    let deltaY: Number = deltaLng * this.oneDegreePoints;

    // Calculate coords of given geolocation
    let x: Number = this.schlossplatzCoordinates['x'] + deltaX;
    let y: Number = this.schlossplatzCoordinates['y'] + deltaY;

    return {'x': x, 'y': y};
  }
}
