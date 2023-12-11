//--------------- Core ------------------------------------------//
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
//--------------COMPONENTS/PAGES-------------------------------//
import { UserManagementPage } from "./user-management.page";

const routes: Routes = [
  {
    path: '',
    component: UserManagementPage
  }
];

@NgModule({
  declarations: [
    UserManagementPage
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})

export class UserManagementPageModule {}
