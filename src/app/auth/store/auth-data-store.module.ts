/*************************************************************************************************
** Imports                                                                                     **
*************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//-- **NgRx Data Store** ------------------------------------------------------------------------//
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './auth.effects';
import * as AuthActions from './auth.reducer';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('auth', AuthActions.authReducer),
    EffectsModule.forFeature([AuthEffects]),
  ],
})
export class AuthDataStoreModule {}
