/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Component, EventEmitter, Input, Output } from "@angular/core";
//-- **Data Models** ----------------------------------------------------------------------------//
//-- **Helpers/Services** -----------------------------------------------------------------------//

@Component({
    selector: 'cstm-simple-artistic-btn',
    templateUrl: './simple-artistic-btn.component.html',
    styleUrls: ['./simple-artistic-btn.component.scss'],
})

/**
 * @export
 * @component SimpleArtisticBtnComponent
 * @example <ion-content>
      <cstm-simple-artistic-btn  (onClick)=someMethodOnPageUsingComponent($event)
                      [label]="Click Me!">
      </cstm-simple-artistic-btn> 
   </ion-content>
 */
export class SimpleArtisticBtnComponent {
    //-------------------------------------------->
    //-- Inputs ---------------------------------->
    @Input() label: string = '';
    @Input() value?: any = null;

    //------------------------------------------>
    //-- Outputs ------------------------------->
    @Output() onClick = new EventEmitter<any>();


    onClickEvent() {
        this.onClick.emit(this.value);
    }
}
