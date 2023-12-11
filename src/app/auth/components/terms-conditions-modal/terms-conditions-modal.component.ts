
//----------- Core  -------------------------------------------------------------------//
import { OnInit, OnDestroy } from '@angular/core';
import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
// import { takeUntil } from 'rxjs/operators';
//------------- Data Store -----------------------------------------------------------//
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.reducer';
// import { selectIsMobileView } from './../../../core/store/core.selectors';

@Component({
  selector: 'terms-conditions-modal',
  templateUrl: './terms-conditions-modal.component.html',
  styleUrls: ['./terms-conditions-modal.component.scss'],
})
export class TermsAndConditionsModalComponent implements OnInit, OnDestroy {
  //-- Core Variables ---------------------->
  private destroy$: Subject<boolean> = new Subject<boolean>();
  mobileView;

  constructor(
    private store: Store<AppState>,
    private modalCtrl: ModalController,
  ) {}


  ngOnInit() {
    // this.store.select(selectIsMobileView).pipe(takeUntil(this.destroy$)).subscribe(isMobileView => {
    //   this.mobileView = isMobileView;
    // })
   }

   dismissModal(){
     this.modalCtrl.dismiss(false);
   }
  
  
  agreedToTerms() {
    this.modalCtrl.dismiss(true)
  }


  // On Page Destruction --------------------------------------------->
  ngOnDestroy() {
   // console.log('Destroyed Skill Level Options Modal Component');
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}

