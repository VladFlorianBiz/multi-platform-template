//--------------- Core -------------------------------------------------------------------------------------------------//
import { NgModule } from "@angular/core";
import { SharedModule } from '../../../shared/shared.module';
//-------------- COMPONENT/MODULES -----------------------------------------------------------------------------------//
import { SideMenuComponent } from './side-menu.component';

@NgModule({
  declarations: [SideMenuComponent],
  imports: [
    SharedModule,
  ],
  exports: [SideMenuComponent]
})
export class SideMenuComponentModule { }
