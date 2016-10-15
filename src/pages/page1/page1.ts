import {Component} from "@angular/core";
import {NavController, Events} from "ionic-angular";
import {Geolocation} from "ionic-native";
import {StuttgartMapsData} from "../../providers/stuttgart-maps-data";

@Component({
  selector: 'page-page1',
  templateUrl: 'page1.html'
})
export class Page1 {

  /**
   * Location information
   */
  private location: Object = null;

  /**
   * Model collection variable with wifi locations
   */
  private wifiLocations: Array = [];

  /**
   * Constructor method
   *
   * @param navCtrl
   * @param events
   * @param stuttgartMapsData
   */
  constructor(public navCtrl: NavController,
              private events: Events,
              private stuttgartMapsData: StuttgartMapsData) {

    // Configure event listeners
    events.subscribe("location:retrieved", this.applyLocation.bind(this));
    events.subscribe("location:retrieved", this.retrieveWifiLocations.bind(this));
    events.subscribe("wifi-location:retrieved", this.retrieveWifiLocationDetails.bind(this));
  }

  /**
   * Method tries to find retrieve the user's location
   */
  retrieveLocation() {

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
      }

      // DEBUG
      console.debug(position);
      // DEBUG

      // Trigger event location retrieved
      this.events.publish("location:retrieved", location);

    }, (err) => {

      // DEBUG
      console.log(err);
      // DEBUG

      // Trigger error event in case of an error
      this.events.publish("error", err);
    });
  }

  /**
   * Method uses STuttgart Maps Data provider to retrieve free city wifi locations next to this
   * @param eventArgs
   */
  retrieveWifiLocations(eventArgs: Array<Object>) {

    //
    let geolocation = eventArgs[0];

    // DEBUG
    console.debug("Call: retrieveWifiLocations");
    console.debug(geolocation);
    // DEBUG

    // Use data provider to retrieve Wifi locations
    // NOTICE: Returns an Observable
    this.stuttgartMapsData.retrieveWifiLocations(geolocation)
                          .subscribe((wifiLocations) => {

      // Store Wifi locations into model variable
      this.wifiLocations = wifiLocations;

      // DEBUG
      console.debug(wifiLocations);
      // DEBUG

      // Iterate retrieved wifi location
      for(let wifiLocationId in wifiLocations) {

        // FIXME: trigger details retrieve differently
        this.events.publish('wifi-location:retrieved', wifiLocationId);
      }

      // DEBUG
      console.debug("Event: retrieveWifiLocations");
      console.debug(wifiLocations);
      // DEBUG
    });
  }

  /**
   * Method uses stuttgart maps data provider to retrieve Wifi location detail information
   * @param eventArgs
   */
  retrieveWifiLocationDetails(eventArgs: Array) {

    // Get wifi location from event args
    let wifiLocationId: Number = eventArgs[0];

    // DEBUG
    console.debug('Call: retrieveWifiLocationDetails');
    console.debug(wifiLocationId);
    // DEBUG

    // Use stuttgart maps data provider ro retrieve wifi location details
    this.stuttgartMapsData.retrieveWifiLocationDetails(wifiLocationId)
                          .subscribe((wifiLocationDetails) => {

      // Merge details in wifiLocations model variable
      Object.assign(this.wifiLocations[wifiLocationId], wifiLocationDetails);

      // DEBUG
      console.debug(this.wifiLocations);
      // DEBUG
    });
  }

  /**
   * Method is used to apply a new given location
   * @param location
   */
  applyLocation(location: Object) {

    // Remember new location in model variable
    this.location = location;
  }
}
