/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
//-- **Components/Pages** -----------------------------------------------------------------------//
import { AccessItemComponent } from './access-item.component';


@NgModule({
    declarations: [AccessItemComponent],
    imports: [
        SharedModule,
    ],
    exports: [
        AccessItemComponent
    ]
})
export class AccessItemComponentModule { }
