/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { NgModule } from '@angular/core';
import { SharedModule } from './../shared/shared.module';
//-- **Page Modules** ---------------------------------------------------------------------------//
import { HomePageModule } from './pages/home/home.page.module';
import { TopNavbarComponentModule } from './components/top-nav-bar/top-nav-bar.component.module';
import { SideNavbarComponentModule } from './components/side-nav-bar/side-nav-bar.component.module';
import { SideMenuComponentModule } from './components/side-menu/side-menu.component.module';
// import { ComponentsPageModule } from './pages/components/components.page.module';


@NgModule({
  declarations: [],
  imports: [
    SharedModule,   
    HomePageModule,
    TopNavbarComponentModule,
    SideNavbarComponentModule,
    SideMenuComponentModule,
    // ComponentsPageModule
  ],
  exports: [
    TopNavbarComponentModule, 
    SideNavbarComponentModule, 
    SideMenuComponentModule
  ]
})
export class CoreModule { }
