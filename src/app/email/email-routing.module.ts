/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';


/**************************************************************************************************
 ** Email Page Urls                                                               
 **  - Configure Email page urls found under email/pages                    
 **  - Look at app.routing for email route prefix; 'email'                           
 **  - Routes can take arguments e.g.  :viewOrUpdate, emailId, :customVariables,           
 **************************************************************************************************/
const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    loadChildren: () => import('./pages/email-list/email-list.page.module').then(m => m.EmailListPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'create',
    loadChildren: () => import('./pages/create-email/create-email.page.module').then(m => m.CreateEmailPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: ':emailId/:viewOrUpdate',  //**Page route Url parameters**
    loadChildren: () => import('./pages/email-detail/email-detail.page.module').then(m => m.EmailDetailPageModule),
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmailRoutingModule { }