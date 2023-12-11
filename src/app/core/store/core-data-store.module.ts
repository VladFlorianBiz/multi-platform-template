/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//-- **NgRx Data Store** ------------------------------------------------------------------------//
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { CoreEffects } from './core.effects';
import * as CoreActions from './core.reducer';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('core', CoreActions.coreReducer),
    EffectsModule.forFeature([CoreEffects]),
  ],
})
export class CoreDataStoreModule {}
