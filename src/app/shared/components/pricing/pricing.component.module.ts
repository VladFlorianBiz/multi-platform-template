/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
//-- **Components/Pages** -----------------------------------------------------------------------//
import { PricingComponent } from './pricing.component';


@NgModule({
    declarations: [PricingComponent],
    imports: [
        SharedModule,
    ],
    exports: [
        PricingComponent
    ]
})
export class PricingComponentModule { }
