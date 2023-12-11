/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


/**************************************************************************************************
 ** Fe@ture Page Urls                                                                            **
 **  - Configure Fe@ture page urls found under fe@ture/pages                                     **
 **  - Look at app.routing for fe@ture route prefix; path                                        **
 **  - Routes can take arguments via :customVariables                                            **
 **************************************************************************************************/
const routes: Routes = [
  // {
  //   path: 'list',
  //   component: CoolListPage
  // },
  // {
  //   path: 'create',  //
  //   component: CreateCoolPage
  // },
  // {
  //   path: ':viewOrUpdate',
  //   component: UpdateCoolPage
  // },
  // {
  //   path: '',
  //   pathMatch: 'full',
  //   redirectTo: 'list',

  // },
  // {
  //   path: '**',
  //   redirectTo: 'app'
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }