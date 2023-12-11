/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//-- **NgRx Data Store** ------------------------------------------------------------------------//
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { UserEffects } from './user.effects';
import * as fromUser from './user.reducer';

@NgModule({
    imports: [
        CommonModule,
        StoreModule.forFeature('user', fromUser.userReducer),
        EffectsModule.forFeature([UserEffects]),
    ],
})
export class UserDataStoreModule { }
