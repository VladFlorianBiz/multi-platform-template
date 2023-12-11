
//--------------- Core ------------------------------------------------------------------------------------------------------------//
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from './../../../shared/shared.module';
//-------------- Modules ----------------------------------------------------------------------------------------------------------//
import { TermsAndConditionsModalComponentModule } from './../../components/terms-conditions-modal/terms-conditions-modal.module';
//--------------COMPONENTS/PAGES-------------------------------------------------------------------------------------------------//
import { SignUpPage } from "./sign-up.page";

const routes: Routes = [
  {
    path: '',
    component: SignUpPage
  }
];

@NgModule({
  declarations: [
    SignUpPage
  ], 
  imports: [
    SharedModule,
    TermsAndConditionsModalComponentModule,
    RouterModule.forChild(routes)
  ],
  schemas: []
})

export class SignUpPageModule {}
