//---------------CORE----------------------------------------//
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//---------------DATA STORE----------------------------------//
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { LocalStorageEffects } from './local-storage.effects';
import * as fromLocalStorage from './local-storage.reducer';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('localStorage', fromLocalStorage.localStorageReducer),
    EffectsModule.forFeature([LocalStorageEffects])
  ],
})
export class LocalStorageDataStoreModule {}
