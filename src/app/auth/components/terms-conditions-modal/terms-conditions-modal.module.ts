//--------------- Core ------------------------------------------------------------------------------------------------//
import { NgModule } from "@angular/core";
import { SharedModule } from '../../../shared/shared.module';
//--------------COMPONENTS/PAGES-------------------------------------------------------------------------------------//
import { TermsAndConditionsModalComponent } from './terms-conditions-modal.component';


@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [TermsAndConditionsModalComponent],
  exports: [TermsAndConditionsModalComponent]
})
export class TermsAndConditionsModalComponentModule {}
