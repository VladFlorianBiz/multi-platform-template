/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
//-- **Components/Pages** -----------------------------------------------------------------------//
import { CreateUserPage } from './create-user.page';
//-- **Component/Page Modules* ------------------------------------------------------------------//
import { UserItemComponentModule } from './../../components/user-item/user-item.component.module';

const routes: Routes = [
  {
    path: '',
    component: CreateUserPage
  }
];

@NgModule({
  declarations: [CreateUserPage],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    //Add Modules Below
    UserItemComponentModule,

  ]
})
export class CreateUserPageModule {}
