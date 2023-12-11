/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module'; 
//-- **Components/Pages** -----------------------------------------------------------------------//
import { ComponentsPage } from './components.page';
//-- **Component/Page Modules* ------------------------------------------------------------------//

const routes: Routes = [
  {
    path: '',
    component: ComponentsPage
  }
];

@NgModule({
  declarations: [ComponentsPage],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    //Add Modules Below

  ]
})
export class ComponentsPageModule {}
