//------------- Core ----------------------------------------------------------------------------------------------------------------------------------//
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
//-------------- Data Store  --------------------------------------------------------------------------------------------------------------------------//

@NgModule({
  imports: [
    //-- CORE -- 
    SharedModule,
  ],
})
export class LocalStorageModule {}
