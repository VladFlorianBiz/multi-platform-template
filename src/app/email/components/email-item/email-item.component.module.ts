/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
//-- **Components/Pages** -----------------------------------------------------------------------//
import { EmailItemComponent } from './email-item.component';


@NgModule({
    declarations: [EmailItemComponent],
    imports: [
        SharedModule,
    ],
    exports: [
        EmailItemComponent
    ]
})
export class EmailItemComponentModule { }
