/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Component, Input, Inject, ChangeDetectionStrategy, SimpleChanges, OnInit, OnDestroy } from '@angular/core';
import { Renderer2} from '@angular/core';
import { DOCUMENT } from '@angular/common'; 
import { takeUntil, take } from 'rxjs/operators';
import { Subject } from 'rxjs';
//------------- Data Store --------------------------------------------------------//
import { AppState } from './../../../app.reducer';
import { Store } from '@ngrx/store';
import * as CoreActions from './../../../core/store/core.actions';
import { selectSelectedPath } from '../../store/core.selectors';

@Component({
  selector: 'app-top-nav-bar',
  templateUrl: './top-nav-bar.component.html',
  styleUrls: ['./top-nav-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class TopNavBarComponent implements OnInit, OnDestroy {
  private destroy$: Subject<boolean> = new Subject<boolean>();

  //-- Inputs -----------------------
  @Input() elementId: string = 'navbarElement';
  @Input() expandNavbar: boolean = false;
  @Input() cartItemCount: number = 0;
  @Input() isAuthenticated: boolean = false;

  //-- Nav Bar Options ---->
  navBarOptions = {
    home: {
      label: 'Home',
      order: 1,
      subHeader: false,
      url: '/home'
    },
    aiUser: {
      label: 'AI Users',
      order: 2,
      subHeader: false,
      url: '/ai-user/list'
    },
    login: {
      label: 'Login',
      order: 3,
      subHeader: true,
      url: '/auth'
    },
    signUp: {
      label: 'Sign Up',
      order: 3,
      subHeader: true,
      url: '/auth/sign-up'
    },
        account: {
      label: 'Account',
      order: 4,
      subHeader: true,
      url: '/user/account'
    }
  }
  navBarOptionsArray = [this.navBarOptions.home, this.navBarOptions.aiUser, this.navBarOptions.login]
  currentNavBarOption = this.navBarOptions.home
  previousNavBarOption = null

  ngOnChanges(changes: SimpleChanges) {
    // console.log('changes', changes)
    if (changes?.expandNavbar?.firstChange == false) {
      // only logged upon a change after rendering
      const addOrRemoveClassEventParam = { 
        elementId: this.elementId, 
        className: "expand-navbar", 
        addClassFlag: changes?.expandNavbar?.currentValue == true, 
        removeClassFlag: changes?.expandNavbar?.currentValue == false 
      }
      this.addOrRemoveClassEvent(addOrRemoveClassEventParam)
    }
  }

  constructor(
    private renderer: Renderer2,
    private store: Store<AppState>,
    @Inject(DOCUMENT) document: Document
  ) { }


  ngOnInit() {
    this.store.select(selectSelectedPath).pipe(take(1), takeUntil(this.destroy$)).subscribe(_selectedPath => {
      const matchingNavUrl = this.navBarOptionsArray.filter(item => _selectedPath == item?.url);
      const isKnownUrl = matchingNavUrl?.length > 0;

      let currentNavBarOption = this.navBarOptions.home;
      let previousNavBarOption = this.navBarOptions.home;
      if (isKnownUrl) {
        currentNavBarOption = {...matchingNavUrl[0]}
        previousNavBarOption = {...matchingNavUrl[0]}
      }

      this.currentNavBarOption = currentNavBarOption;
      this.previousNavBarOption = previousNavBarOption;
    })
  }





  goToPage(navbarOption) {
    this.previousNavBarOption = { ...this.currentNavBarOption };
    this.currentNavBarOption = { ...navbarOption };

    let direction = 'forward';
    if (this.currentNavBarOption.order <= this.previousNavBarOption?.order) {
      direction = 'back'
    }


    
    this.store.dispatch(new CoreActions.NavigateToPage({
      pageNavigation: {
        url: this.currentNavBarOption?.url,
        animated: true,
        animatedDirection: direction,
        isRootPage: true,
        data: null
      }
    }));
  }



 

  addOrRemoveClassEvent({ elementId, className, addClassFlag, removeClassFlag }: { elementId: string, className: string, addClassFlag: boolean, removeClassFlag: boolean }) {
    const htmlElement = document.getElementById(elementId);

    if (addClassFlag && !htmlElement.classList.contains(className)) {
      this.renderer.addClass(htmlElement, className);
    }

    if (removeClassFlag && htmlElement.classList.contains(className)) {
      this.renderer.removeClass(htmlElement, className);
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
