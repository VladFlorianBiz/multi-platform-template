/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Component, EventEmitter, Input, Output } from "@angular/core";
//-- **Data Models** ----------------------------------------------------------------------------//
//-- **Helpers/Services** -----------------------------------------------------------------------//

@Component({
    selector: 'cstm-snow-background',
    templateUrl: './snow-background.component.html',
    styleUrls: ['./snow-background.component.scss'],
})

/**
 * @export
 * @component SnowBackgroundComponent
 * @example <ion-content>
      <cstm-snow-background  (onClick)=someMethodOnPageUsingComponent($event)
                      [name]="someVariableOnPageUsingComponent" 
                      [description]="someVariableOnPageUsingComponent" 
                      [value]="<someVariableOnPageUsingComponent">
      </cstm-snow-background> 
   </ion-content>
 */
export class SnowBackgroundComponent {
    //-------------------------------------------->
    //-- Inputs ---------------------------------->
    @Input() name: string = '';
    @Input() description: string = '';
    @Input() value?: any = null;
    //--
    @Input() height?: any = `250px`; //250px | 100vh | 'none'
    @Input() width?: any = `250px`; //250px | 100vh | 'none'
    @Input() backgroundColor?: string = "black";

    constructor(
        // private uiHelper: UiHelper,
    ) { }



}
