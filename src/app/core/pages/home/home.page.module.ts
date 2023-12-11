
/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
//-- **Components/Pages** -----------------------------------------------------------------------//
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage
  }
];

@NgModule({
  declarations: [HomePage],
  imports: [
    //-- Core ---------------------//
    SharedModule,
    RouterModule.forChild(routes),
  ]
})

export class HomePageModule {}
