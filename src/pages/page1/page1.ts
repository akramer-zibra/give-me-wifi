import {Component} from "@angular/core";
import {NavController, Events} from "ionic-angular";
import {Geolocation} from "ionic-native";
import {StuttgartMapsData} from "../../providers/stuttgart-maps-data";
import {StuttgartMapsCoordinatesCalculator} from "../../services/stuttgart-maps-coordinates-calculator";
import {ValuesPipe} from "../../pipes/values";
import {CompletePipe} from "../../pipes/complete";

@Component({
  selector: 'page-page1',
  templateUrl: 'page1.html',
  pipes: [CompletePipe, ValuesPipe]
})
export class Page1 {

  /**
   * Location information
   */
  private location: Object = null;

  /**
   * This is a collection for temporary data which is not complete yet
   * @type {{}}
   */
  private tmpWifiLocations: Object = {};

  /**
   * Model collection variable with wifi locations
   */
  private wifiLocations: Object = {};

  /**
   * Constructor method
   *
   * @param navCtrl
   * @param events
   * @param stuttgartMapsData
   * @param stuttgartMapsCoordinatesCalculator
   */
  constructor(public navCtrl: NavController,
              private events: Events,
              private stuttgartMapsData: StuttgartMapsData,
              private stuttgartMapsCoordinatesCalculator: StuttgartMapsCoordinatesCalculator) {

    // Configure event listeners
    events.subscribe("location:retrieved", this.applyLocation.bind(this));
    events.subscribe("location:retrieved", this.retrieveWifiLocations.bind(this));
    events.subscribe("wifi-location:retrieved", this.retrieveWifiLocationDetails.bind(this));
    events.subscribe("wifi-location:retrieved", this.retrieveWifiLocationDistance.bind(this));
    events.subscribe("wifi-location-model:changed", this.completeCheckWifiLocation.bind(this));
  }

  /**
   * Method tries to find retrieve the user's location
   */
  retrieveLocation(): void {

    // DEBUG
    console.debug("retrieveLocation");
    // DEBUG

    // Use Geoelocation component to retrieve the device's location
    Geolocation.getCurrentPosition().then((position) => {

      // Remember retrieved position in member variable
      let location = {
        "lat": position.coords.latitude,
        "lng": position.coords.longitude,
        "timestamp": position.timestamp
      };

      // Trigger event location retrieved
      this.events.publish("location:retrieved", location);

    }, (err) => {

      // Trigger error event in case of an error
      this.events.publish("error", err);
    });
  }

  /**
   * Method uses STuttgart Maps Data provider to retrieve free city wifi locations next to this
   * @param eventArgs
   */
  retrieveWifiLocations(eventArgs: Array<Object>): void {

    //
    let geolocation = eventArgs[0];

    // Use data provider to retrieve Wifi locations
    // NOTICE: Returns an Observable
    this.stuttgartMapsData.retrieveWifiLocations(geolocation)
                          .subscribe((wifiLocations) => {

      // Store Wifi locations into model variable
      this.tmpWifiLocations = wifiLocations;

      // Trigger wifi location model changed event
      this.events.publish('wifi-location-model:changed', wifiLocationId);

      // Iterate retrieved wifi location
      for(let wifiLocationId in wifiLocations) {

        // Trigger details retrieve differently
        this.events.publish('wifi-location:retrieved', wifiLocationId);
      }
    });
  }

  /**
   * Method uses stuttgart maps data provider to retrieve Wifi location detail information
   * @param eventArgs
   */
  retrieveWifiLocationDetails(eventArgs: Array): void {

    // Get wifi location from event args
    let wifiLocationId: Number = eventArgs[0];

    // Use stuttgart maps data provider ro retrieve wifi location details
    this.stuttgartMapsData.retrieveWifiLocationDetails(wifiLocationId)
                          .subscribe((wifiLocationDetails) => {

                            // Merge details in wifiLocations model variable
                            // @see http://stackoverflow.com/a/38860354/2145395
                            (<any>Object).assign(this.tmpWifiLocations[wifiLocationId], wifiLocationDetails);

                            // Trigger wifi location model changed event
                            this.events.publish('wifi-location-model:changed', wifiLocationId);
    });
  }

  /**
   * Method retrieves calculated distance in kilometers beeline
   * @param eventArgs
   */
  retrieveWifiLocationDistance(eventArgs: Array): void {

    // Get wifi location from event args
    let wifiLocationId: Number = eventArgs[0];

    // Use data from temporary object
    let tmpWifiLOcationObject = this.tmpWifiLocations[wifiLocationId];

    // Use Stuttgart Maps calculator service
    let distanceBeeline = this.stuttgartMapsCoordinatesCalculator.calculateDistanceBetweenGeolocations(this.location, tmpWifiLOcationObject['location']);

    // Merge route distance beeline into tmp collection
    (<any>Object).assign(this.tmpWifiLocations[wifiLocationId], {'route': {'distance-beeline': distanceBeeline}});

    // Trigger wifi location model changed event
    this.events.publish('wifi-location-model:changed', wifiLocationId);
  }

  /**
   * Method checks if specified wifi location is data complete for displaying
   * @param eventArgs
   */
  completeCheckWifiLocation(eventArgs: Array): void {

    // Get wifi location from event args
    let wifiLocationId: Number = eventArgs[0];

    // Try to find specified
    if(!this.tmpWifiLocations.hasOwnProperty(wifiLocationId)) {
      return;
    }

    //
    let tmpWifiLocationObject = this.tmpWifiLocations[wifiLocationId];

    // Check completion criterias
    if(tmpWifiLocationObject.hasOwnProperty('details')
        && tmpWifiLocationObject['details'].hasOwnProperty('name')
        && tmpWifiLocationObject.hasOwnProperty('route')
        && tmpWifiLocationObject['route'].hasOwnProperty('distance-beeline')) {

      // Copy WifiLocation object from tmp to model variable
      this.wifiLocations[wifiLocationId] = tmpWifiLocationObject;
    }
  }

  /**
   * Method is used to apply a new given location
   * @param eventArgs
   */
  applyLocation(eventArgs: Array): void {

    // Extract location from event args
    let location = eventArgs[0];

    // Remember new location in model variable
    this.location = location;
  }
}
