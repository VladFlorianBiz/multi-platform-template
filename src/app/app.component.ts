/*****************************************************************************************************
** Imports *******************************************************************************************
******************************************************************************************************/
//-- **Core** ---------------------------------------------------------------------------------------//
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil, take, withLatestFrom } from 'rxjs/operators';
import { Router, RouterEvent, RoutesRecognized } from '@angular/router';
import { filter, pairwise } from 'rxjs/operators';
import { AnimationController } from '@ionic/angular';
//-- **Services/Helpers** --------------------------------------------//
import { AudioHelper } from './shared/helpers/audio.helper';
import { AuthSubService } from './auth/services/auth-sub.service';
import { SqlService } from './local-storage/services/sqlite.service';
//-- **NgRx Data Store** ---------------------------------------------//
import { AppState } from './app.reducer';
import { Store } from '@ngrx/store';
import * as CoreActions from './core/store/core.actions';
import { selectIsAuthenticated } from './auth/store/auth.selectors';
import { selectIsMobileView, selectNavBarConfig, selectSelectedPath } from './core/store/core.selectors';
import { selectLoadingModalConfig, selectPageNavigation, selectLastPageNavigation } from './core/store/core.selectors';
//-- **Data Models** ------------------------------------------------//
import { navBarTypeOptions, LoadingModalConfig, initialLoadingModalConfig } from './core/models/core.model';
import { NavBarConfig } from './core/models/core.model';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent implements OnInit, OnDestroy {
  private destroy$: Subject<boolean> = new Subject<boolean>();
  isAuthenticated$: boolean;
  isMobileView$: boolean;
  selectedPath = '';
  navBarConfig: NavBarConfig
  navBarTypeOptions = navBarTypeOptions;
  loadingModalConfig: LoadingModalConfig = { ...initialLoadingModalConfig };
  cartItemCount: number = 0;
  sideMenuIsOpen: boolean = false;

  constructor(
    private platform: Platform,
    private store: Store<AppState>,
    private router: Router,
    private audioHelper: AudioHelper,
    private authSubService: AuthSubService,
    private navCtrl: NavController,
    private animationCtrl: AnimationController,
    private sqlService: SqlService,

  ) {
    //-------------------------------------------------------------------------------------->
    //-- Listen on url route change (only runs when after navigating AWAY from first page) ->
    this.router.events.pipe(
      filter(e => e instanceof RoutesRecognized),
      pairwise() // check it's second route load
    ).subscribe((e: any[]) => {

      const oldPath: RouterEvent = {
        ...e[0]
      }
      const newPath: RouterEvent = {
        ...e[1]
      }

      // console.log('oldPath', oldPath)
      // console.log('newPath', newPath)
      // console.log('currentPath', currentPath)

      if (oldPath?.url != newPath?.url) {
        this.store.dispatch(new CoreActions.SetSelectedPath({ selectedPath: newPath?.url }))
      }
    });


    //-- Set First Url Route Change (only takes 1 and closes subscription)
    this.router.events.pipe(
      filter(e => e instanceof RoutesRecognized),
      take(1)
    ).subscribe((e: any) => {
      // console.log('e',e )
      const url =  e.url 

      const currentPath = this.router.url;


      this.store.dispatch(new CoreActions.SetSelectedPath({ selectedPath: url }))
    });


    //-------------------------------------------------------------------------------------->
    //-------------------------------------------------------------------------------------->


    //-------------------------------------------------------------------------------------->
    //-- Listen on url route change (only runs when navigating TO First page load) --------->
    this.router.events.pipe(
      distinctUntilChanged(),
      take(1)
    ).subscribe((event: RouterEvent) => {
      if (event && event.url) {
        this.selectedPath = event.url;
        this.store.dispatch(new CoreActions.SetSelectedPath({ selectedPath: event?.url }))

      }
    })
    //-------------------------------------------------------------------------------------->
    //-------------------------------------------------------------------------------------->

    this.initializeApp();
  }


  setSideMenuIsOpen(status) {
    this.sideMenuIsOpen = status;
  }


  enterAnimation = (baseEl: HTMLElement) => {
    const root = baseEl.shadowRoot;

    const backdropAnimation = this.animationCtrl
      .create()
      .addElement(root.querySelector('ion-backdrop')!)
      .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

    const wrapperAnimation = this.animationCtrl
      .create()
      .addElement(root.querySelector('.modal-wrapper')!)
      .keyframes([
        { offset: 0, opacity: '0', transform: 'scale(0)' },
        { offset: 1, opacity: '0.99', transform: 'scale(1)' },
      ]);

    return this.animationCtrl
      .create()
      .addElement(baseEl)
      .easing('ease-out')
      .duration(400)
      .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  leaveAnimation = (baseEl: HTMLElement) => {
    return this.enterAnimation(baseEl).direction('reverse').duration(100)
  };


  initializeApp() {
    //-- Initialize Sound Files ---------------------------------------->
    this.audioHelper.preload('save', 'assets/audio/save2.mp3');
    this.audioHelper.preload('select', 'assets/audio/select.wav');
    this.audioHelper.preload('deselect', 'assets/audio/deselect.wav');


    this.platform.ready().then(async () => {
      
      // this.pulseChainService.getToken('0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599').then(res => {
      //   console.log('RESPONSE FROM PULSECHAIN', res)
      // })

      // this.pulseChainService.getTokenInfo('0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599').then(res => {
      //   console.log('RESPONSE FROM PULSECHAIN', res)
      // })
      //-- Set Initial width size ----------------------------------------------------->
      if (this.platform.width() < 600) {
        this.store.dispatch(new CoreActions.SetIsMobileView({ isMobileView: true }))
      } else if (this.platform.width() > 600) {
        this.store.dispatch(new CoreActions.SetIsMobileView({ isMobileView: false }))
      }



      //-- Initialize Local Storage Db ------>
      await this.sqlService.initializeAll();


    });
    //------------------------------------------------------------------------------->


    //------------------------------------------------------------------------------->
  }


  ngOnInit() {
    // this.store.dispatch(new AuthActions.ListenToAuthChanges());


    //------------------------------------------------------------------------------------------------------------------------------------------------------->
    //-- Global Handling Of Page Navigation ----------------------------------------------------------------------------------------------------------------->
    this.store.select(selectPageNavigation).pipe(
      withLatestFrom(this.store.select(selectLastPageNavigation), this.store.select(selectSelectedPath)),
      takeUntil(this.destroy$)
    ).subscribe(([pageNavigation, lastPageNavigation, _selectedPath]) => {


      if (pageNavigation?.url !== null && _selectedPath !== undefined && _selectedPath !== null) {


        const selectedPath = _selectedPath
        const lastPageURLIsSameAsPageURL = pageNavigation.url == selectedPath;
        // console.log('#1**Page Navigation**', pageNavigation);
        // console.log('#2**Last Page Navigation**', lastPageNavigation);
        // console.log('#3**lastPageURLIsSameAsPageURL**', lastPageURLIsSameAsPageURL);
        // console.log('#3**selectedPath**', selectedPath);

        // const currentPath = this.router.url;



        if (!lastPageURLIsSameAsPageURL ) {
          const isForwardAnimatedDirection = pageNavigation.animatedDirection == 'forward';
          const isRootPage = pageNavigation.isRootPage;
          if (isRootPage) {
            this.navCtrl.navigateRoot(pageNavigation.url, { animated: pageNavigation.animated, animationDirection: pageNavigation.animatedDirection })
          } else {
            if (isForwardAnimatedDirection) {
              this.navCtrl.navigateForward(pageNavigation.url, { animated: pageNavigation.animated, animationDirection: pageNavigation.animatedDirection })
            } else {
              this.navCtrl.navigateBack(pageNavigation.url, { animated: pageNavigation.animated, animationDirection: pageNavigation.animatedDirection })
            }
          }
        }
      }

    })
    //------------------------------------------------------------------------------------------------------------------------------------------------------->
    //------------------------------------------------------------------------------------------------------------------------------------------------------->




    this.store.select(selectLoadingModalConfig).pipe(takeUntil(this.destroy$)).subscribe(_loadingModalConfig => {
      this.loadingModalConfig = { ..._loadingModalConfig };
      // if (_loadingModalConfig.show == true) {
      //   this.uiHelper.showLoader(_loadingModalConfig?.message)
      // } else {
      //   this.uiHelper.hideLoader();
      // }
    })


    this.store.select(selectIsMobileView).pipe(
      distinctUntilChanged(),
      takeUntil(this.destroy$)
      ).subscribe((isMobileView) => {
      this.isMobileView$ = isMobileView;
    })

    this.store.select(selectSelectedPath).pipe(takeUntil(this.destroy$)).subscribe(selectedPath => {
      this.selectedPath = selectedPath;
    })

    this.store.select(selectIsAuthenticated).pipe(takeUntil(this.destroy$)).subscribe(isAuthenticated => {
      this.isAuthenticated$ = isAuthenticated;
    })

    this.store.select(selectNavBarConfig).pipe(takeUntil(this.destroy$)).subscribe(navBarConfig => {
      this.navBarConfig = { ...navBarConfig };
      // console.log('**NAVBARCONFIG UPDATED!!***', this.navBarConfig)
    })
  }

  ngOnDestroy() {
    this.authSubService.authUnsubscribeComponent$.next();
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  //-- Listen to window width size change ------------------------------------------>
  @HostListener('window:resize', ['$event'])
  private onResize(event) {
    const screenWidth = event.target.innerWidth;
    if (screenWidth < 600 && this.isMobileView$ === false) {
      this.store.dispatch(new CoreActions.SetIsMobileView({ isMobileView: true }))
    } else if (screenWidth > 600 && this.isMobileView$ === true) {
      this.store.dispatch(new CoreActions.SetIsMobileView({ isMobileView: false }))
    }
  }

}
