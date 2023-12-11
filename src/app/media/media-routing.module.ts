/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


/**************************************************************************************************
 ** Media Page Urls                                                               
 **  - Configure Media page urls found under media/pages                    
 **  - Look at app.routing for media route prefix; 'media'                           
 **  - Routes can take arguments e.g.  :viewOrUpdate, mediaId, :customVariables,           
 **************************************************************************************************/
const routes: Routes = [
  // {
  //   path: '',
  //   pathMatch: 'full',
  //   redirectTo: 'list',
  // },
  // {
  //   path: 'list',
  //   loadChildren: () => import('./pages/media-list/media-list.page.module').then(m => m.MediaListPageModule)
  // },
  // {
  //   path: 'create',
  //   loadChildren: () => import('./pages/create-media/create-media.page.module').then(m => m.CreateMediaPageModule)
  // },
  // {
  //   path: ':mediaId/:viewOrUpdate',  //**Page route Url parameters**
  //   loadChildren: () => import('./pages/media-detail/media-detail.page.module').then(m => m.MediaDetailPageModule)
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MediaRoutingModule { }