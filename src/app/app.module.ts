import {NgModule} from "@angular/core";
import {IonicApp, IonicModule} from "ionic-angular";
import {StuttgartFinderApp} from "./app.component";
import {Page1} from "../pages/page1/page1";
import {Page2} from "../pages/page2/page2";
import {ValuesPipe} from "../pipes/values";
import {StuttgartMapsData} from "../providers/stuttgart-maps-data";
import {StuttgartMapsCalculator} from "../services/stuttgart-maps-coordinates-calculator";

@NgModule({
  declarations: [
    StuttgartFinderApp,
    Page1,
    Page2,
    ValuesPipe
  ],
  imports: [
    IonicModule.forRoot(StuttgartFinderApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    StuttgartFinderApp,
    Page1,
    Page2
  ],
  providers: [StuttgartMapsData, StuttgartMapsCalculator]
})
export class AppModule {}
