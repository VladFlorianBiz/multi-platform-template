/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { ViewChild, ElementRef } from '@angular/core';
import { NavController } from '@ionic/angular';
//-- **NgRx Data Store** ------------------------------------------------------------------------//
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.reducer';
import * as CoreActions from './../../store/core.actions';
//-- **Data Models** ----------------------------------------------------------------------------//
import { navBarTypeOptions } from './../../models/core.model';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.page.html',
  styleUrls: ['./admin-dashboard.page.scss'],
})
export class AdminDashboardPage implements OnInit, OnDestroy {
  //-- Core Variables ------------------------------------------->
  private destroy$: Subject<boolean> = new Subject<boolean>();
  constructor() { }

  ngOnInit() {
    
  }


  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
