/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Component, Input } from "@angular/core";
//-- **Data Models** ----------------------------------------------------------------------------//
//-- **Helpers/Services** -----------------------------------------------------------------------//

@Component({
    selector: 'cstm-type-writer-label',
    templateUrl: './type-writer-label.component.html',
    styleUrls: ['./type-writer-label.component.scss'],
})


export class TypeWriterLabelComponent{
    //---------------------------------------------------------->
    //-- Inputs ------------------------------------------------>
    @Input() label: string = 'Test ME';
    @Input() labelLength: number = 7;
    @Input() showWhenCondition: boolean;


    constructor(
        // private uiHelper: UiHelper,
    ) {
        // Run functions in class constructor(runs before ngOnInit & some imports me not be available) 
        //
    }
}
