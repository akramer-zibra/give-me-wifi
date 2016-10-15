import {Component} from "@angular/core";
import {NavController, Events} from "ionic-angular";
import {Geolocation} from "ionic-native";
import {StuttgartMapsData} from "../../providers/stuttgart-maps-data";
import {StuttgartMapsCalculator} from "../../services/stuttgart-maps-calculator";
import {ValuesPipe} from "../../pipes/values";
import {MLocation} from "../../model/location";
import {MWifiLocation} from "../../model/wifi-location";

@Component({
  selector: 'page-page1',
  templateUrl: 'page1.html',
  pipes: [ValuesPipe]
})
export class Page1 {

  /**
   * Location information
   */
  private location: MLocation = null;

  /**
   * This is a collection for temporary data which is not complete yet
   * @type {{}}
   */
  private tmpWifiLocations: {[id: number] : MWifiLocation} = {};

  /**
   * Model collection variable with wifi locations
   */
  private wifiLocations: {[id: number] : MWifiLocation} = {};

  /**
   * Constructor method
   *
   * @param navCtrl
   * @param events
   * @param stuttgartMapsData
   * @param stuttgartMapsCalculator
   */
  constructor(public navCtrl: NavController,
              private events: Events,
              private stuttgartMapsData: StuttgartMapsData,
              private stuttgartMapsCalculator: StuttgartMapsCalculator) {

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

    // Use Geoelocation component to retrieve the device's location
    Geolocation.getCurrentPosition().then((position) => {

      // Remember retrieved position in member variable
      let location: MLocation = {
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
  retrieveWifiLocations(eventArgs: Array<MLocation>): void {

    //
    let geolocation: MLocation = eventArgs[0];

    // Use data provider to retrieve Wifi locations
    // NOTICE: Returns an Observable
    this.stuttgartMapsData.retrieveWifiLocations(geolocation)
                          .subscribe((wifiLocations) => {

      // Store Wifi locations into model variable
      this.tmpWifiLocations = wifiLocations;

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
    let tmpWifiLocationObject = this.tmpWifiLocations[wifiLocationId];

    // Use Stuttgart Maps calculator service
    let distanceBeeline = this.stuttgartMapsCalculator.calculateDistanceBetweenGeolocations(this.location, tmpWifiLocationObject['location']);

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
    if(!this.tmpWifiLocations.hasOwnProperty(wifiLocationId.toString())) {
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
  applyLocation(eventArgs: Array<MLocation>): void {

    // Remember new location in model variable
    this.location = eventArgs[0];
  }
}
