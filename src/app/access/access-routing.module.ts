/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';


/**************************************************************************************************
 ** Access Page Urls                                                               
 **  - Configure Access page urls found under access/pages                    
 **  - Look at app.routing for access route prefix; 'access'                           
 **  - Routes can take arguments e.g.  :viewOrUpdate, accessId, :customVariables,           
 **************************************************************************************************/
const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    loadChildren: () => import('./pages/access-list/access-list.page.module').then(m => m.AccessListPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'create',
    loadChildren: () => import('./pages/create-access/create-access.page.module').then(m => m.CreateAccessPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: ':accessId/:viewOrUpdate',  //**Page route Url parameters**
    loadChildren: () => import('./pages/access-detail/access-detail.page.module').then(m => m.AccessDetailPageModule),
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccessRoutingModule { }