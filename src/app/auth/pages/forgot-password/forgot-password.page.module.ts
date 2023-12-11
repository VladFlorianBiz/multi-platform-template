//--------------- Core ------------------------------------------//
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from './../../../shared/shared.module';
//--------------COMPONENTS/PAGES-------------------------------//
import { ForgotPasswordPage } from "./forgot-password.page";

const routes: Routes = [
  {
    path: '',
    component: ForgotPasswordPage
  }
];

@NgModule({
  declarations: [
    ForgotPasswordPage
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})

export class ForgotPasswordPageModule {}
