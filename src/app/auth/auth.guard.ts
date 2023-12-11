/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, } from '@angular/router';
import { Observable } from 'rxjs';
import { tap, take } from 'rxjs/operators';
//-- **NgRx Data Store** ------------------------------------------------------------------------//
import { Store, select } from '@ngrx/store';
import { AppState } from './../app.reducer';
import { selectIsAuthenticated } from './store/auth.selectors';
import * as CoreActions from './../core/store/core.actions';
//-- **Data Models** ------------------------------------------------------------------------//
import { initialLoadingModalConfig } from './../core/models/core.model';
//-- **Services/Helpers** -----------------------------------------------------------------------//

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanLoad, CanActivate {

  constructor(
    private store: Store<AppState>,
  ) { }

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {

    return this.store
      .pipe(
        select(selectIsAuthenticated),
        tap(loggedIn => {
          if (!loggedIn) {
            this.store.dispatch(new CoreActions.SetLoadingModalConfig({ loadingModalConfig: { ...initialLoadingModalConfig } }));
            this.store.dispatch(new CoreActions.NavigateToPage({
              pageNavigation: {
                url: "/auth/login",
                animated: true,
                animatedDirection: 'back',
                isRootPage: true,
                data: null
              }
            }));
            // this.navCtrl.navigateRoot('auth/login', { animationDirection: 'back' });
          }
        }),
        take(1)
      );
  }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.store
      .pipe(
        select(selectIsAuthenticated),
        tap(loggedIn => {
          if (!loggedIn) {
            this.store.dispatch(new CoreActions.SetLoadingModalConfig({ loadingModalConfig: { ...initialLoadingModalConfig } }));
            this.store.dispatch(new CoreActions.NavigateToPage({
              pageNavigation: {
                url: "/auth/login",
                animated: true,
                animatedDirection: 'back',
                isRootPage: true,
                data: null
              }
            }));
            // this.navCtrl.navigateRoot('auth/login', { animationDirection: 'back' });
            // this.navCtrl.navigateRoot('', { animationDirection: 'back' });
          }
        }),
        take(1)
      );
  }
}
