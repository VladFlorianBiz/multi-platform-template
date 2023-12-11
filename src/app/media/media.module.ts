/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { MediaRoutingModule } from './media-routing.module';

@NgModule({
    imports: [
        SharedModule,
        MediaRoutingModule,
    ]
})
export class MediaModule { }
