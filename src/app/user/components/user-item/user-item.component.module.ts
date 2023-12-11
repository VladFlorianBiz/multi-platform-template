/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
//-- **Components/Pages** -----------------------------------------------------------------------//
import { UserItemComponent } from './user-item.component';


@NgModule({
    declarations: [UserItemComponent],
    imports: [
        SharedModule,
    ],
    exports: [
        UserItemComponent
    ]
})
export class UserItemComponentModule { }
