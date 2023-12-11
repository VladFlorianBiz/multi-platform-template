/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Component, EventEmitter, Input, Output } from "@angular/core";
//-- **Data Models** ----------------------------------------------------------------------------//
import { MediaDb } from './../../../media/models/media.model';

//-- **Helpers/Services** -----------------------------------------------------------------------//

@Component({
    selector: 'cstm-item-card',
    templateUrl: './item-card.component.html',
    styleUrls: ['./item-card.component.scss'],
})

/**
 * @export
 * @component ItemCardComponent
 * @example <ion-content>
      <cstm-item-card  (onClick)=someMethodOnPageUsingComponent($event)
                      [name]="someVariableOnPageUsingComponent" 
                      [description]="someVariableOnPageUsingComponent" 
                      [value]="<someVariableOnPageUsingComponent">
      </cstm-item-card> 
   </ion-content>
 */
export class ItemCardComponent {
    //-------------------------------------------->
    //-- Inputs ---------------------------------->
    @Input() name: string = '';
    @Input() description: string = '';
    @Input() media: MediaDb[] = [];
    @Input() value?: any = null;
    @Input() showMoreOptionsFlag?: boolean = false;

    //------------------------------------------>
    //-- Outputs ------------------------------->
    @Output() onClick = new EventEmitter<any>();


    /************************************************************************************
    * @constructor Component Constructor
    * @description  Initialize Class and Dependencies(Imports), see SOME examples below.
    *							- Helpers: UiHelper, userDataObjHelper, FirebaseHelper
    *							- Services: userService
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
                 <cstm-item-card (onClick)=someMethodOnPageUsingComponent($event)>
                 </cstm-item-card> 
              </ion-content>
    * @description When itemCard component emits a click event it will
    *							   - emits the value found inside this component(this.value) to any page/component using it
    * @return any
    */
    onClickEvent() {
        this.onClick.emit(this.value);
    }

}
