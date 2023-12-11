/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, take, takeUntil } from 'rxjs';
import { ViewChild } from '@angular/core';
import { IonContent, ScrollDetail } from '@ionic/angular';
//-- **NgRx Data Store** ------------------------------------------------------------------------//
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.reducer';
import * as CoreActions  from './../../store/core.actions';
import { selectIsMobileView } from '../../store/core.selectors';
import { selectCurrentUser } from '../../../user/store/user.selectors';
//-- **Data Models** ----------------------------------------------------------------------------//
import { initialNavBarConfig, navBarTypeOptions } from './../../models/core.model';
import { UserDb, initialUserDb } from '../../../user/models/user.model';
//-- **Services/Helpers** ----------------------------------------------------------------------------//
import { UiHelper } from './../../../shared/helpers/ui.helper';
import { regexValidators } from '../../../shared/helpers/validators.helper';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})

export class HomePage implements OnInit, OnDestroy {
  //-- Core Variables ------------------------------------------->
  private destroy$: Subject<boolean> = new Subject<boolean>();
  //-- Expand Navbar Vars ----------------------------------------------------------------------------> 
  // the element that you are observing (just add #scrollArea in the template) for this  query to work
  // @ViewChild('scrollArea') scrollArea: ElementRef;
  @ViewChild(IonContent) content: IonContent;
  hideNavBarFlag: boolean = false;
  leavingPage: boolean = true;
  isMobileView: boolean = false;
  currentUser: UserDb = {...initialUserDb}
  formObj: UntypedFormGroup;
  formInitialized = false;
  inputTouchedOnce = {
    email: null,
  }
  private fragment: string | null = null;


  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private uiHelper: UiHelper,
    private route: ActivatedRoute
  ) {}


  ngOnInit() {
    const navBarConfig = {
      ...initialNavBarConfig,
      type: navBarTypeOptions.landing,
    }
    this.store.dispatch(new CoreActions.SetNavBarConfig({ navBarConfig }));


    this.route.fragment.subscribe(fragment => {
      console.log('fragment', fragment)
      this.fragment = fragment;
    });

    this.store.select(selectIsMobileView).pipe(
      takeUntil(this.destroy$),
    ).subscribe((isMobileView) => {
      this.isMobileView = isMobileView
    })

    this.store.select(selectCurrentUser).pipe(
      takeUntil(this.destroy$),
    ).subscribe((currentUser) => {
      this.currentUser = {...currentUser}
      // console.log('currentUser!!', currentUser)
    })

    this.initForm()
  }

  ngAfterViewInit() {
    console.log('important ', this.fragment)
    if (this.fragment) {
      this.scrollToFragment(this.fragment);
    }

  }


  scrollToFragment(fragment: string | null) {
    if (fragment) {
      setTimeout(() => {
        const element = document.getElementById('pricing');
        if (element) {
          const rect = element.getBoundingClientRect();
          const x = rect.left + window.scrollX;
          const y = rect.top + window.scrollY;
          this.content.scrollToPoint(x, y, 2000);
        }
      }, 500); // Adjust the delay as needed
    }
  }


  onPlanSelected(plan) {
    console.log('plan selected in home', plan)
    const userId = this.currentUser?.id;
    const userIsLoggedIn = userId?.length > 0

    if (userIsLoggedIn) {

    } else {
      this.uiHelper.displayToast("You must be logged in to change or subscribe to a plan", 4000, 'top')
      this.store.dispatch(new CoreActions.NavigateToPage({
        pageNavigation: {
          url: '/auth',
          animated: true,
          animatedDirection: 'forward',
          isRootPage: true,
          data: null  
        }
      }));
    }

  }

  /**
* @method initForm
* @description Initializes formObj by setting initial form values and, Sets form validation logic.
*							   - Access form value in typescript e.g. this.formObj?.value?.name
*							   - Access form value in HTML e.g. {{formObj?.value?.name}}
* @return void
*/
  initForm(): void {
    //---------------------------------------------------------------------------/
    this.formObj = this.fb.group({  //**add any form fields that are added below in 'inputTouchedOnce' Object ***/
      email: ['', [Validators.compose([Validators.pattern(regexValidators.email), Validators.required, Validators.minLength(1)])]],
    });

    this.formInitialized = true;
  }



  ionViewWillEnter() {
    // Scrolls to the top of the content area
    if (!this.fragment) {
      this.content.scrollToTop();
    }

    this.leavingPage = false;

  }


  ionViewWillLeave() {
    // Scrolls to the top of the content area
    this.leavingPage = true
  }




  goToChatPage() {
    this.store.dispatch(new CoreActions.NavigateToPage({
      pageNavigation: {
        url: '/chat/list',
        animated: true,
        animatedDirection: 'forward',
        isRootPage: true,
        data: null
      }
    }));
  }


  handleScroll(ev: CustomEvent<ScrollDetail>) {
    // console.log('scroll', ev.detail);

    if (this.isMobileView) {
      const topPosition = ev.detail.currentY
      const showHideNavBarFlag = topPosition > 80;

      if (showHideNavBarFlag && this.hideNavBarFlag == false) {
        this.hideNavBarFlag = true;
        const navBarConfig = {
          type: navBarTypeOptions.blank,
          expand: true
        }
        this.store.dispatch(new CoreActions.SetNavBarConfig({ navBarConfig }));
      }
      else if (!showHideNavBarFlag && this.hideNavBarFlag == true) {
        this.hideNavBarFlag = false;
        const navBarConfig = {
          type: navBarTypeOptions.landing,
          expand: false
        }
        this.store.dispatch(new CoreActions.SetNavBarConfig({ navBarConfig }));
      }
    } else {
      const topPosition = ev.detail.currentY
      const showHideNavBarFlag = topPosition > 80;

      if (showHideNavBarFlag && this.hideNavBarFlag == false) {
        this.hideNavBarFlag = true;
        const navBarConfig = {
          type: navBarTypeOptions.landing,
          expand: true
        }
        this.store.dispatch(new CoreActions.SetNavBarConfig({ navBarConfig }));
      }
      else if (!showHideNavBarFlag && this.hideNavBarFlag == true) {
        this.hideNavBarFlag = false;
        const navBarConfig = {
          type: navBarTypeOptions.landing,
          expand: false
        }
        this.store.dispatch(new CoreActions.SetNavBarConfig({ navBarConfig }));
      }
    }
  }



  navigateToPage(url, direction: 'forward' | 'back', isRoot) {
    this.store.dispatch(new CoreActions.NavigateToPage({
      pageNavigation: {
        url: url,
        animated: true,
        animatedDirection: direction,
        isRootPage: isRoot,
        data: null
      }
    }));
  }

  joinNewsLetter() {
    const formIsVlad = this.formObj?.valid;

    if (formIsVlad) {
      const email = this.formObj?.value?.email;
      //-- TO DO add email to data base ----
      this.formObj?.patchValue({
        email: ''
      })
      this.uiHelper.displayToast('You have successfully enrolled!', 5000, 'bottom')
    } else {
      this.uiHelper.displayToast('Enter a valid email', 5000, 'bottom')
    }
  }



//************************************************************************************************************************************************************************** */ 
//************************************************************************************************************************************************************************** */ 
//************************************************************************************************************************************************************************** */ 
  // addOrRemoveClassEvent({ elementId, className, addClassFlag, removeClassFlag }: { elementId: string, className: string, addClassFlag: boolean, removeClassFlag: boolean }) {
  //   if (addClassFlag && !this.isMobileView) {
  //     const navBarConfig = { 
  //       type: navBarTypeOptions.landing, 
  //       expand: true 
  //     }
  //     this.store.dispatch(new CoreActions.SetNavBarConfig({ navBarConfig }));
  //   } else if (!addClassFlag && !this.isMobileView) {
  //     const navBarConfig = {
  //       type: navBarTypeOptions.landing,
  //       expand: false
  //     }
  //     this.store.dispatch(new CoreActions.SetNavBarConfig({ navBarConfig }));
  //   }
  // }

  /**
* @method onInputBlur
* @param formControlName the from control name that was set when creating `this.formObj =`
* @description Checks if the form input has been touched at least once and then updates 'inputTouchedOnce' object.
*							   - When form input loses focus the ionBlur event occurs
*							   - HTML Example. <ion-input legacy="true"  (ionBlur)="onInputBlur('name')"></ion-input>
* @return void
*/
  onInputBlur(formControlName) {
    const inputHasBeenTouchedAtLeastOnce = this.inputTouchedOnce[formControlName] == true;
    const inputTouchedOnceLastValue = { ...this.inputTouchedOnce }

    if (!inputHasBeenTouchedAtLeastOnce || !this.formInitialized) {
      const formFieldTouchUpdateValue = (this.inputTouchedOnce[formControlName] == null)
        ? true
        : false;

      this.inputTouchedOnce = {
        ...inputTouchedOnceLastValue,
        [formControlName]: formFieldTouchUpdateValue
      }
    }
  }



  ngOnDestroy() {
    // if (this.cards) {
    //   this.cards.forEach(card => {
    //     card.removeEventListener('pointermove', this.handlePointerMove.bind(this));
    //   });
    // }

    // if (this.cardResizeObserver) {
    //   this.cardResizeObserver.disconnect();
    // }

    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}