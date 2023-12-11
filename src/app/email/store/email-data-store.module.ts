/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//-- **NgRx Data Store** ------------------------------------------------------------------------//
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { EmailEffects } from './email.effects';
import * as fromEmail from './email.reducer';

@NgModule({
    imports: [
        CommonModule,
        StoreModule.forFeature('email', fromEmail.emailReducer),
        EffectsModule.forFeature([EmailEffects]),
    ],
})
export class EmailDataStoreModule { }
