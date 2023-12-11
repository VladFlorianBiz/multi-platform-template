//--------------- Core ----------------------------------------------------------------------------------------------//
import { NgModule } from "@angular/core";
import { SharedModule } from '../../../shared/shared.module';
//-------------- COMPONENT/MODULES --------------------------------------------------------------------------------//
import { SideNavBarComponent } from './side-nav-bar.component';

@NgModule({
  declarations: [SideNavBarComponent],
  imports: [
    SharedModule,
  ],
  exports: [SideNavBarComponent]
})
export class SideNavbarComponentModule { }
