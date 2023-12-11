/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { NgModule } from '@angular/core';
import { SharedModule } from './../shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';
//---------------COMPONENTS/PAGES MODULES---------------------------------------------------------------------//
import { LoginPageModule } from './pages/login/login.page.module';
import { UserManagementPageModule } from './pages/user-management/user-management.page.module';
import { ChangePasswordPageModule } from './pages/change-password/change-password.page.module';

@NgModule({
  imports: [
    //-- Core -- 
    SharedModule,
    AuthRoutingModule,
    //-- Page Modules -- 
    LoginPageModule,
    UserManagementPageModule,
    ChangePasswordPageModule
  ],
})
export class AuthModule {}
