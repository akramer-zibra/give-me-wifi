import "rxjs/Rx";
import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions, Response} from "@angular/http";
import {StuttgartMapsCoordinatesCalculator} from "../services/stuttgart-maps-coordinates-calculator";
import {Observable} from "rxjs";

@Injectable()
export class StuttgartMapsData {

  /**
   * Data provider settings
   * @type {{endpointUrl: string, boxSizeHeightPts: number, boxSizeWidthPts: number}}
   */
  private settings : Object = {
    endpointUrl : "http://gis6.stuttgart.de/atlasfx/spring/rest/MapServer/6369/query",
    boxSizeWidthPts: 2000,
    boxSizeHeightPts: 2000
  }

  /**
   * Variable with constants
   * @type {RegExp}
   * @see http://stackoverflow.com/q/1500260/2145395
   */
  private constants : Object = {
    LINK_DETECTION_REGEX : /(([a-z]+:\/\/)?(([a-z0-9\-]+\.)+([a-z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel|local|internal))(:[0-9]{1,5})?(\/[a-z0-9_\-\.~]+)*(\/([a-z0-9_\-\.]*)(\?[a-z0-9+_\-\.%=&amp;]*)?)?(#[a-zA-Z0-9!$&'()*+.=-_~:@/?]*)?)(\s+|$)/gi
  }

  /**
   * Constructor method
   * @param http
   * @param stuttgartMapsCoordinatesCalculator
   */
  constructor(private http: Http,
              private stuttgartMapsCoordinatesCalculator: StuttgartMapsCoordinatesCalculator) {}

  /**
   * Method uses http client to ask stuttgart maps server for wifi locations
   *
   * @param location
   */
  retrieveWifiLocations(location: Object): Observable<Response> {

    // Convert geolocation to coords
    let coords: Object = this.stuttgartMapsCoordinatesCalculator.convertGeolocationToCoords(location);

    // Calculate border box with configurable point-width
    let xMin = coords['x'] - (0.5 * this.settings['boxSizeWidthPts']);
    let xMax = coords['x'] + (0.5 * this.settings['boxSizeWidthPts']);
    let yMin = coords['y'] - (0.5 * this.settings['boxSizeHeightPts']);
    let yMax = coords['y'] + (0.5 * this.settings['boxSizeHeightPts']);

    // Previously stringify geometry
    let paramGeometry = JSON.stringify({"xmin": xMin,"ymin": yMin,"xmax": xMax,"ymax": yMax,"spatialReference":{"wkid":31467}});
    let encodedParamGeometry = encodeURIComponent(paramGeometry);

    // ...and append encoded json object to param string
    var bodyParamString = 'f=json&geometryType=esriGeometryEnvelope&returnGeometry=true&outSR=31467&inSR=31467&spatialRel=esriSpatialRelContains&geometry=' + encodedParamGeometry;

    // Configure request headers
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });

    // Do POST request and return an Observable
    return this.http.post(this.settings['endpointUrl'], bodyParamString, options)
                    .map((res: Response) => this.extractWifiLocations(res))
                    .catch(this.handleError);
  }

  /**
   * Method extracts wifi locations from received api response
   * @param response
   * @type {Object}
   */
  extractWifiLocations(response: Response): Object {

    // Convert received response into a JSON object
    let responseJson = response.json();

    // Initialize empty objects collection with index on itemId
    var wifiLocationObjects = {};

    // Extract encapsulated wifi location from response message
    for(let wifiLocationIdx in responseJson['features']) {

      // TODO: refactor to event triggered procession
      // ...convert coords to geolocation
      // ...retrieve detailed information about the location

      // Convert coords to geolocation
      let location = this.stuttgartMapsCoordinatesCalculator.convertCoordsToGeolocation(responseJson['features'][wifiLocationIdx]['geometry']);

      // Extract location identifier
      let wifiLocationId = responseJson['features'][wifiLocationIdx]['attributes']['id'];

      // Copy wifi location data to result collection
      wifiLocationObjects[wifiLocationId] = {
        'attributes': responseJson['features'][wifiLocationIdx]['attributes'],
        'geometry': responseJson['features'][wifiLocationIdx]['geometry'],
        'location': location
      };
    }

    //
    return wifiLocationObjects;
  }

  /**
   * TODO: Method converts retrieved Wifi location coords to geolocation
   */
  processWifiLocationCoordsConvert() {}

  /**
   * TODO: Method retrieves detailed information about a certain Wifi location
   */
  processWifiLocationDetailRetrieve() {}

  /**
   * Method retrieves wifi location details from Stuttgart Maps server
   * @param wifiLocationId
   * @type {String}
   */
  retrieveWifiLocationDetails(wifiLocationId: Number): Observable {

    // http://gis6.stuttgart.de/atlasfx/spring/rest/InfoBubble/6369/12668
    return this.http.get('http://gis6.stuttgart.de/atlasfx/spring/rest/InfoBubble/6369/'+ wifiLocationId)
                   .map((res: Response) => this.extractWifiLocationDetails(res))
                   .catch(this.handleError);
  }

  /**
   * Method extracts Wifi Location details from the given response object
   * @param response
   */
  extractWifiLocationDetails(response: Response): Object {

    // Use response object as JSON object
    let responseJson = response.json();

    // Extract interesting data into new object
    let details = {
      'name': responseJson['body'][1]['data'],
      'street': responseJson['body'][2]['data'],
      'postalcode': responseJson['body'][3]['data'],
      'city': responseJson['body'][4]['data']
    };

    // Try to find a link to stuttgart website
    let linkMatch = responseJson['body'][5]['data'].match(this.constants['LINK_DETECTION_REGEX']);
    details['link'] = (linkMatch && linkMatch.length > 0) ? linkMatch[0] : null;

    // Return details object with complete flag
    return {'details': details,
            'complete': true};
  }

  /**
   * Method handles errors occured within http request
   *
   * @param error
   */
  handleError(error: any) {

    // DEBUG
    console.debug(error);
    // DEBUG
  }
}
