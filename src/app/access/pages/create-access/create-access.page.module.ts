/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
//-- **Components/Pages** -----------------------------------------------------------------------//
import { CreateAccessPage } from './create-access.page';
//-- **Component/Page Modules* ------------------------------------------------------------------//
import { AccessItemComponentModule } from './../../components/access-item/access-item.component.module';

const routes: Routes = [
  {
    path: '',
    component: CreateAccessPage
  }
];

@NgModule({
  declarations: [CreateAccessPage],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    //Add Modules Below
    AccessItemComponentModule,

  ]
})
export class CreateAccessPageModule {}
