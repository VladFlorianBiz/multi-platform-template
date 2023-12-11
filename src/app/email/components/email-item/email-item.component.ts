/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Component, EventEmitter, Input, Output } from "@angular/core";
//-- **Data Models** ----------------------------------------------------------------------------//
import { EmailDb, initialEmailDb } from './../../models/email.model';
//-- **Helpers/Services** -----------------------------------------------------------------------//

@Component({
    selector: 'cstm-email-item',
    templateUrl: './email-item.component.html',
    styleUrls: ['./email-item.component.scss'],
})

/**
 * @export
 * @component EmailItemComponent
 * @example <ion-content>
      <cstm-email-item  (onClick)=someMethodOnPageUsingComponent($event)
                      [name]="someVariableOnPageUsingComponent1" 
                      [description]="someVariableOnPageUsingComponent2" 
                      [email]="emailVariableOnPageUsingComponent">
      </cstm-email-item> 
   </ion-content>
 */
export class EmailItemComponent {
    //-------------------------------------------->
    //-- Inputs ---------------------------------->
    @Input() name: string = '';
    @Input() description: string = '';
    @Input() email?: EmailDb = { ...initialEmailDb };

    //------------------------------------------>
    //-- Outputs ------------------------------->
    @Output() onClick = new EventEmitter<any>();


    /************************************************************************************
    * @constructor Component Constructor
    * @description  Initialize Class and Dependencies(Imports), see SOME examples below.
    *							- Helpers: UiHelper, EmailDataObjHelper, FirebaseHelper
    *							- Services: EmailService
    *							- Ionic: NavController, ModalController
    *							- Form: FormBuilder
    *							- State: Store<AppState>
    * @return void
    **************************************************************************************/
    constructor(
        // private uiHelper: UiHelper,
    ) {
        // Run functions in class constructor(runs before ngOnInit & some imports me not be available) 
        //
    }


    /**
    * @method onClickEvent
    * @example <ion-content>
                 <cstm-email-item (onClick)=someMethodOnPageUsingComponent($event)>
                 </cstm-email-item> 
              </ion-content>
    * @description When emailItem component emits a click event it will
    *							   - emits the value found inside this component(this.email) to any page/component using it
    * @return any
    */
    onClickEvent() {
        this.onClick.emit(this.email);
    }

}
