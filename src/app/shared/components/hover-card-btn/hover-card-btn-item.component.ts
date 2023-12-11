/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Component, EventEmitter, Input, Output } from "@angular/core";
//-- **Data Models** ----------------------------------------------------------------------------//
//-- **Helpers/Services** -----------------------------------------------------------------------//

@Component({
    selector: 'cstm-hover-card-btn-item',
    templateUrl: './hover-card-btn-item.component.html',
    styleUrls: ['./hover-card-btn-item.component.scss'],
})

/**
 * @export
 * @component HoverCardBtnItemComponent
 * @example <ion-content>
      <cstm-hover-card-btn-item  (onClick)=someMethodOnPageUsingComponent($event)
                      [name]="someVariableOnPageUsingComponent1" 
                      [description]="someVariableOnPageUsingComponent2" 
                      [hoverCardBtn]="hoverCardBtnVariableOnPageUsingComponent">
      </cstm-hover-card-btn-item> 
   </ion-content>
 */
export class HoverCardBtnItemComponent{
    //---------------------------------------------------------->
    //-- Inputs ------------------------------------------------>
    @Input() title: string = '';
    @Input() subtitle: string = '';
    @Input() buttonText: string = '';
    //------------------------------------------>
    //-- Outputs ------------------------------->
    // @Output() onClick = new EventEmitter<any>();


    /************************************************************************************
    * @constructor Component Constructor
    * @description  Initialize Class and Dependencies(Imports), see SOME examples below.
    *							- Helpers: UiHelper, HoverCardBtnDataObjHelper, FirebaseHelper
    *							- Services: HoverCardBtnService
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



    // /**
    // * @method onClickEvent
    // * @example <ion-content>
    //              <cstm-hoverCardBtn-item (onClick)=someMethodOnPageUsingComponent($event)>
    //              </cstm-hoverCardBtn-item> 
    //           </ion-content>
    // * @description When hoverCardBtnItem component emits a click event it will
    // *							   - emits the value found inside this component(this.hoverCardBtn) to any page/component using it
    // * @return any
    // */
    // onClickEvent() {
    //     this.onClick.emit(this.hoverCardBtn);
    // }

}
