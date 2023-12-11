/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
//-- **Components/Pages** -----------------------------------------------------------------------//
import { EmailDetailPage } from './email-detail.page';
//-- **Component/Page Modules* ------------------------------------------------------------------//
import { EmailItemComponentModule } from './../../components/email-item/email-item.component.module';


const routes: Routes = [
  {
    path: '',
    component: EmailDetailPage
  }
];


@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    //Add Modules Below
    EmailItemComponentModule,
  ],
  declarations: [EmailDetailPage]
})
export class EmailDetailPageModule {}
