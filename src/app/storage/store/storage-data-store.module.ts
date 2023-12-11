//--------------- Core ----------------------------------------//
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//--------------- Data Store ----------------------------------//
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StorageEffects } from '././storage.effects';
import * as fromStorage from './storage.reducer';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('storage', fromStorage.storageReducer),
    EffectsModule.forFeature([StorageEffects])
  ],
})
export class StorageDataStoreModule {}
