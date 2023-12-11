/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AccessRoutingModule } from './access-routing.module';

@NgModule({
    imports: [
        SharedModule,
        AccessRoutingModule,
    ]
})
export class AccessModule { }
