/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
//-- **Pages** ----------------------------------------------------------------------------------//
import { HomePage } from './core/pages/home/home.page';

//-- **Page/Feature URL Routes** ----------------------------------------------------------------//
const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '/',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  /*******************************************************************************************************************************
  Customer Routes
  *******************************************************************************************************************************/
  {
    path: 'home',
    component: HomePage
  },
  {
    path: 'components',
    loadChildren: () => import('../app/core/pages/components/components.page.module').then(m => m.ComponentsPageModule)
  },
  {
    path: 'about',
    loadChildren: () => import('../app/core/pages/about/about.page.module').then(m => m.AboutPageModule)
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then(m => m.UserModule)
  },
  /*******************************************************************************************************************************
  Auth Routes
  *******************************************************************************************************************************/
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  /*******************************************************************************************************************************
  Admin Routes
  *******************************************************************************************************************************/
  {
    path: 'access',
    loadChildren: () => import('./access/access.module').then(m => m.AccessModule)
  },
  {
    path: 'admin/dashboard',
    canActivate: [AuthGuard],
    loadChildren: () => import('./core/pages/admin-dashboard/admin-dashboard.page.module').then(m => m.AdminDashboardPageModule)
  },
  {
    path: 'media',
    loadChildren: () => import('./media/media.module').then(m => m.MediaModule)
  },
  {
    path: 'email',
    loadChildren: () => import('./email/email.module').then(m => m.EmailModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
