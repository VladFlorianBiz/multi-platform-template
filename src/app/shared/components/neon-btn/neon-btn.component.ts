/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Component, EventEmitter, Input, Output } from "@angular/core";
//-- **Data Models** ----------------------------------------------------------------------------//
//-- **Helpers/Services** -----------------------------------------------------------------------//

@Component({
    selector: 'cstm-neon-btn',
    templateUrl: './neon-btn.component.html',
    styleUrls: ['./neon-btn.component.scss'],
})

/**
 * @export
 * @component NeonBtnComponent
 * @example <ion-content>
      <cstm-neon-btn  (onClick)=someMethodOnPageUsingComponent($event)
                      label="Neon BUTTONS" 
                      height="none"
                      backgroundColor="#222" 
                      fontFamily="Permanent Marker" 
                      color="var(--ion-color-secondary)" 
                      [value]="null">
      </cstm-neon-btn> 
   </ion-content>
 */
export class NeonBtnComponent {
    //-------------------------------------------->
    //-- Inputs ---------------------------------->
    @Input() label: string = 'Neon BUTTONS';
    @Input() height: any = `none`; //100vh | 'none'
    @Input() backgroundColor: string = '#222';
    @Input() fontFamily: string = 'Permanent Marker';
    @Input() color: string = "var(--ion-color-secondary)";
    @Input() value?: any = null;

    //------------------------------------------>
    //-- Outputs ------------------------------->
    @Output() onClick = new EventEmitter<any>();



    onClickEvent() {
        this.onClick.emit(this.value);
    }

}
