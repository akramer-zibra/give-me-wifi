import { Component } from '@angular/core';

import { NavController, Events } from 'ionic-angular';

import { Geolocation } from 'ionic-native';

import { StuttgartMapsData } from '../../providers/stuttgart-maps-data';

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
  private wifiLocations: Array;

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
      this.location = {
        "lat": position.coords.latitude,
        "lng": position.coords.longitude,
        "timestamp": position.timestamp
      }

      // DEBUG
      console.debug(position);
      // DEBUG

      // Trigger event location retrieved
      this.events.publish("location:retrieved", this.location);

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
    this.stuttgartMapsData.getWifiLocations(geolocation)
                          .subscribe((wifiLocations) => {

      // Store Wifi locations into model variable
      this.wifiLocations = wifiLocations;

      // DEBUG
      console.debug("Event: retrieveWifiLocations");
      console.debug(wifiLocations);
      // DEBUG
    });
  }

  /**
   * Method is used to apply a new given location
   * @param location
   */
  applyLocation(location: Object) {

    // DEBUG
    console.debug("Call: applyLocation");
    console.debug(location);
    // DEBUG
  }

  /**
   * Method returns if device has been located and a location is known
   * @return {boolean}
   */
  hasLocation() {

    return (this.location != null);
  }

  /**
   * Method returns TRUE if locarion of this device is unknown, and FALSE if its known
   * @return {boolean}
   */
  unknownLocation() {

    // Check if location is known
    return !this.hasLocation();
  }
}
