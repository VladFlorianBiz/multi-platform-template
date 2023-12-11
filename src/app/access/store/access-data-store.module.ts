/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//-- **NgRx Data Store** ------------------------------------------------------------------------//
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AccessEffects } from './access.effects';
import * as fromAccess from './access.reducer';

@NgModule({
    imports: [
        CommonModule,
        StoreModule.forFeature('access', fromAccess.accessReducer),
        EffectsModule.forFeature([AccessEffects]),
    ],
})
export class AccessDataStoreModule { }
