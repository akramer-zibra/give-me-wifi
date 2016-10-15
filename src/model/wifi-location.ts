import {MLocation} from "./location";
import {MCoordinates} from "./coordinates";

/**
 * Defines a WifiLocation Object
 */
export interface MWifiLocation {
  attributes: any,
  geometry: MCoordinates,
  location: MLocation,
  details?: any,
  route?: any
}
