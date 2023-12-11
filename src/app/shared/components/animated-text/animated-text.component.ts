/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Component, EventEmitter, Input, Output } from "@angular/core";
//-- **Data Models** ----------------------------------------------------------------------------//
//-- **Helpers/Services** -----------------------------------------------------------------------//

@Component({
    selector: 'cstm-animated-text',
    templateUrl: './animated-text.component.html',
    styleUrls: ['./animated-text.component.scss'],
})

/**
 * @export
 * @component AnimatedTextComponent
 * @example <ion-content>
      <cstm-animated-text
                           title="Title Label 
                           subTitle="Subtitle Label">
      </cstm-animated-text> 
   </ion-content>
 */
export class AnimatedTextComponent {
    //-------------------------------------------->
    //-- Inputs ---------------------------------->
    @Input() title: string = '';
    @Input() subTitle: string = '';
    //---
    @Input() backgroundColor?: string = "black";
    @Input() titleColor?: string = "#fff";
    @Input() subTitleColor?: string = "#ffffff";
    @Input() height?: any = `250px`; //250px | 100vh | 'none'
    @Input() width?: any = `250px`; //250px | 100vh | 'none'


    constructor(
        // private uiHelper: UiHelper,
    ) { }




}
