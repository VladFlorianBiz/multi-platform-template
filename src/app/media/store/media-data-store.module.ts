/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//-- **NgRx Data Store** ------------------------------------------------------------------------//
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { MediaEffects } from './media.effects';
import * as fromMedia from './media.reducer';

@NgModule({
    imports: [
        CommonModule,
        StoreModule.forFeature('media', fromMedia.mediaReducer),
        EffectsModule.forFeature([MediaEffects]),
    ],
})
export class MediaDataStoreModule { }
