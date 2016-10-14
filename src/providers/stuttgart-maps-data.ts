import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions, Response} from "@angular/http";
import "rxjs/Rx";

@Injectable()
export class StuttgartMapsData {

  /**
   * Constructor method
   * @param http
   */
  constructor(private http: Http) {}

  /**
   * Method uses http client to ask stuttgart maps server for wifi locations
   *
   * @param location
   */
  getWifiLocations(location: Object): Observable<Response> {

    // DEBUG
    console.debug("Call: getWifiLocations");
    console.debug(location);
    // DEBUG

    // Previously stringify geometry
    let paramGeometry = JSON.stringify({"xmin":3509921.872788079,"ymin":5402207.854838709,"xmax":3513837.7139530946,"ymax":5406103.852214037,"spatialReference":{"wkid":31467}});

    // Build API post request with params
    let body = encodeURIComponent({f: "json",
                               geometryType: "esriGeometryEnvelope",
                               returnGeometry: true,
                               outSR: 31467,
                               inSR: 31467,
                               spatialRel: "esriSpatialRelContains",
                               geometry: paramGeometry});

    // DEBUG
    console.debug(body);
    // DEBUG

    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });

    // Do POST request and return an Observable
    // TODO: http://gis6.stuttgart.de/atlasfx/spring/rest/MapServer/6369/query
    return this.http.post("/stuttgart-maps-api", body, options)
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
