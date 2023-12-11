/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module'; 
//-- **Components/Pages** -----------------------------------------------------------------------//
import { UserListPage } from './user-list.page';
//-- **Component/Page Modules* ------------------------------------------------------------------//
import { UserItemComponentModule } from './../../components/user-item/user-item.component.module';

const routes: Routes = [
  {
    path: '',
    component: UserListPage
  }
];

@NgModule({
  declarations: [UserListPage],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    //Add Modules Below
    UserItemComponentModule,

  ]
})
export class UserListPageModule {}
