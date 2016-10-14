import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions, Response} from "@angular/http";
import "rxjs/Rx";

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
   * Constructor method
   * @param http
   */
  constructor(private http: Http) {}

  /**
   * Method uses http client to ask stuttgart maps server for wifi locations
   *
   * @param coords
   */
  getWifiLocations(coords: Object): Observable<Response> {

    // DEBUG
    console.debug("Call: getWifiLocations");
    console.debug(coords);
    // DEBUG

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
                    .map((res: Response) => res.json())
                    .catch(this.handleError);
  }

  /**
   * TODO: Method gets wifi website item link from Stuttgart Maps server
   * @param locationId
   */
  getWifiWebsiteItemLink(locationId: Number): String {}

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
