/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//--------------- Pages -------------------------------------------------------------------------//
import { LoginPage } from './pages/login/login.page';
import { UserManagementPage } from './pages/user-management/user-management.page';
import { ChangePasswordPage } from './pages/change-password/change-password.page';

/**************************************************************************************************
 ** Fe@ture Page Urls                                                                            **
 **  - Configure Fe@ture page urls found under feature/pages                                     **
 **  - Look at app.routing for feature route prefix; path                                        **
 **  - Routes can take arguments via :customVariables                                            **
 **************************************************************************************************/
const routes: Routes = [
  // {
  //   path: '',
  //   pathMatch: 'full',
  //   redirectTo: 'login'
  // },
  {
    path: 'login',
    component: LoginPage
  },
  {
    path: 'user-management',
    component: UserManagementPage,
  },
  {
    path: 'sign-up',
    loadChildren: () => import('./pages/sign-up/sign-up.page.module').then(m => m.SignUpPageModule)
  },

  {
    path: 'change-password',
    component: ChangePasswordPage,

    // loadChildren: () => import('./pages/change-password/change-password.page.module').then(m => m.ChangePasswordPageModule)
  },
  {
    path: 'email-verified',
    loadChildren: () => import('./pages/email-verified/email-verified.page.module').then(m => m.EmailVerifiedPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./pages/forgot-password/forgot-password.page.module').then(m => m.ForgotPasswordPageModule)
  },
  // {
  //   path: 'user-management',
  //   // component: UserManagementPage,
  //   loadChildren: () => import('./pages/user-management/user-management.page.module').then(m => m.UserManagementPageModule)
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }