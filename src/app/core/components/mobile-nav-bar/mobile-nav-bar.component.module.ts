//--------------- Core ----------------------------------------------------------------------------------------------//
import { NgModule } from "@angular/core";
import { SharedModule } from '../../../shared/shared.module';
//-------------- COMPONENT/MODULES --------------------------------------------------------------------------------//
import { TopNavBarComponent } from './top-nav-bar.component';

@NgModule({
  declarations: [TopNavBarComponent],
  imports: [
    SharedModule,
  ],
  exports: [TopNavBarComponent]
})
export class TopNavbarComponentModule { }
