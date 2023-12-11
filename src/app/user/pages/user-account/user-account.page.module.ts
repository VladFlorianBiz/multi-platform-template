/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module'; 
//-- **Components/Pages** -----------------------------------------------------------------------//
import { UserAccountPage } from './user-account.page';
//-- **Component/Page Modules* ------------------------------------------------------------------//

const routes: Routes = [
  {
    path: '',
    component: UserAccountPage
  }
];

@NgModule({
  declarations: [UserAccountPage],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    //Add Modules Below

  ]
})
export class UserAccountPageModule {}
