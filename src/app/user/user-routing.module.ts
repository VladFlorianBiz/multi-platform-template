/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';


/**************************************************************************************************
 ** User Page Urls                                                               
 **  - Configure User page urls found under user/pages                    
 **  - Look at app.routing for user route prefix; 'user'                           
 **  - Routes can take arguments e.g.  :viewOrUpdate, userId, :customVariables,           
 **************************************************************************************************/
const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    loadChildren: () => import('./pages/user-list/user-list.page.module').then(m => m.UserListPageModule),
    canActivate: [AuthGuard],

  },
  {
    path: 'create',
    loadChildren: () => import('./pages/create-user/create-user.page.module').then(m => m.CreateUserPageModule),
    canActivate: [AuthGuard],
    
  },
  {
    path: ':userId/:viewOrUpdate',  //**Page route Url parameters**
    loadChildren: () => import('./pages/user-detail/user-detail.page.module').then(m => m.UserDetailPageModule),
     canActivate: [AuthGuard],
  },
  {
    path: 'account',  //**Page route Url parameters**
    loadChildren: () => import('./pages/user-account/user-account.page.module').then(m => m.UserAccountPageModule),
    // canActivate: [AuthGuard],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }