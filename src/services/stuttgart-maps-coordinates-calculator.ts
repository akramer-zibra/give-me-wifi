import {Injectable} from "@angular/core";

@Injectable()
export class StuttgartMapsCoordinatesCalculator {

  /**
   * Defines how many kilometers are represented in one point
   * @type {number}
   */
  private pointKilometer: Number = 0.00100948;

  /**
   * Defines how many coordinate points equas to one degree in geolocaion scale
   * @type {number}
   */
  private oneDegreePoints: Number = 31304.248840319872506331995788156;

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
   * Geolocation of Stuttgart Marktplatz
   * @type {{lat: string; lng: string}}
   */
  private marktplatzGeolocation: Object = {
    'lat': '48.77527685',
    'lng': '9.17829394'
  }

  /**
   * Point coordinates of STuttgart Marktplatz
   * @type {{x: number; y: number}}
   */
  private marktplatzCoordinates: Object = {
    'x': 3513184,
    'y': 5404218
  }

  /**
   * Geolocation of Stuttgart Hauptbahnhofturm
   * @type {{lat: string; lng: string}}
   */
  private touristinfoGeolocation: Object = {
    'lat': '',
    'lng': ''
  }

  /**
   * Point Coordinates of Stuttgarr Tourist Information
   * @type {{x: number; y: number}}
   */
  private touristinfoCoordinates: Object = {
    'x': 3513459,
    'y': 5404998
  }

  /**
   * Constructor method
   */
  constructor() {}

  /**
   * TODO: Method converts coords to geolocation
   * @param coords
   * @type {{lat: string, lng: string}}
   */
  convertCoordsToGeolocation(coords: Object): Object {

    return {'lat': '', 'lng': ''};
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
