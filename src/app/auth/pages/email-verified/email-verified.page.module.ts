//--------------- Core ------------------------------------------//
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
//--------------COMPONENTS/PAGES-------------------------------//
import { EmailVerifiedPage } from "./email-verified.page";

const routes: Routes = [
  {
    path: '',
    component: EmailVerifiedPage
  }
];

@NgModule({
  declarations: [
    EmailVerifiedPage
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})

export class EmailVerifiedPageModule {}
