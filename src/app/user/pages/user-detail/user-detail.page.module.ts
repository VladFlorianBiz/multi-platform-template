/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
//-- **Components/Pages** -----------------------------------------------------------------------//
import { UserDetailPage } from './user-detail.page';
//-- **Component/Page Modules* ------------------------------------------------------------------//
import { UserItemComponentModule } from './../../components/user-item/user-item.component.module';


const routes: Routes = [
  {
    path: '',
    component: UserDetailPage
  }
];


@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    //Add Modules Below
    UserItemComponentModule,
  ],
  declarations: [UserDetailPage]
})
export class UserDetailPageModule {}
