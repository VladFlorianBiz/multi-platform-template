/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
//-- **Components/Pages** -----------------------------------------------------------------------//
import { CreateEmailPage } from './create-email.page';
//-- **Component/Page Modules* ------------------------------------------------------------------//
import { EmailItemComponentModule } from './../../components/email-item/email-item.component.module';

const routes: Routes = [
  {
    path: '',
    component: CreateEmailPage
  }
];

@NgModule({
  declarations: [CreateEmailPage],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    //Add Modules Below
    EmailItemComponentModule,

  ]
})
export class CreateEmailPageModule {}
