/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Component, Input } from "@angular/core";
//-- **Data Models** ----------------------------------------------------------------------------//
//-- **Helpers/Services** -----------------------------------------------------------------------//

@Component({
    selector: 'cstm-waves-full-background',
    templateUrl: './waves-full-background.component.html',
    styleUrls: ['./waves-full-background.component.scss'],
})

/**
 * @export
 * @component WavesFullBackgroundComponent
 * @example <ion-content>
      <cstm-waves-full-background
                      [color1]="rgb(34, 34, 34, 0.7)" 
                      [color2]="rgb(34, 34, 34, 0.5)" 
                      [color3]="rgb(34, 34, 34, 0.3)"
                      [color4]="rgb(34, 34, 34)"
                      [animated]="true">
      </cstm-waves-full-background> 
   </ion-content>
 */
export class WavesFullBackgroundComponent {
    //-------------------------------------------->
    //-- Inputs ---------------------------------->
    @Input() color1: any = "#222222B3";
    @Input() color2: any = "#22222280";
    @Input() color3: any = "#2222224C";
    @Input() color4: any = "#222222";
    @Input() height?: any = "42vh";
    @Input() backgroundColor1: any = "rgba(84, 58, 183, 1)";
    @Input() backgroundColor2: any = "rgba(0, 172, 193, 1)";
    @Input() animated: boolean = false;
    @Input() inverted?: boolean = false;


    constructor(
        // private uiHelper: UiHelper,
    ) {  }

}
