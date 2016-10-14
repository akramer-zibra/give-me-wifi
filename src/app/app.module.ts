import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { StuttgartFinderApp } from './app.component';
import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';

import { StuttgartMapsData } from '../providers/stuttgart-maps-data';

@NgModule({
  declarations: [
    StuttgartFinderApp,
    Page1,
    Page2
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
  providers: [StuttgartMapsData]
})
export class AppModule {}
