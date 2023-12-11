/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//-- **NgRx Data Store** ------------------------------------------------------------------------//
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ErrorEffects } from './error.effects';
import * as ErrorActions from './error.reducer';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('error', ErrorActions.errorReducer),
    EffectsModule.forFeature([ErrorEffects])
  ],
})
export class ErrorDataStoreModule {}
