//--------------- Core ------------------------------------------//
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
//--------------COMPONENTS/PAGES-------------------------------//
import { ChangePasswordPage } from "./change-password.page";

const routes: Routes = [
  {
    path: '',
    component: ChangePasswordPage
  }
];

@NgModule({
  declarations: [
    ChangePasswordPage
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})

export class ChangePasswordPageModule {}
