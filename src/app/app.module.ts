import {NgModule} from "@angular/core";
import {IonicApp, IonicModule} from "ionic-angular";
import {StuttgartFinderApp} from "./app.component";
import {Page1} from "../pages/page1/page1";
import {ValuesPipe} from "../pipes/values";
import {StuttgartMapsData} from "../providers/stuttgart-maps-data";
import {StuttgartMapsCalculator} from "../services/stuttgart-maps-calculator";

@NgModule({
  declarations: [
    StuttgartFinderApp,
    Page1,
    ValuesPipe
  ],
  imports: [
    IonicModule.forRoot(StuttgartFinderApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    StuttgartFinderApp,
    Page1
  ],
  providers: [StuttgartMapsData, StuttgartMapsCalculator]
})
export class AppModule {}
