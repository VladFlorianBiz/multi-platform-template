/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Component, EventEmitter, Input, Output } from "@angular/core";
//-- **Data Models** ----------------------------------------------------------------------------//
//-- **Helpers/Services** -----------------------------------------------------------------------//

@Component({
    selector: 'cstm-circle-hover-btn',
    templateUrl: './circle-hover-btn.component.html',
    styleUrls: ['./circle-hover-btn.component.scss'],
})

/**
 * @export
 * @component CircleHoverBtnComponent
 * @example <ion-content>
      <cstm-circle-hover-btn  (onClick)=someMethodOnPageUsingComponent($event)
                      [name]="someVariableOnPageUsingComponent" 
                      [description]="someVariableOnPageUsingComponent" 
                      [value]="<someVariableOnPageUsingComponent">
      </cstm-circle-hover-btn> 
   </ion-content>
 */
export class CircleHoverBtnComponent {
    //-------------------------------------------->
    //-- Inputs ---------------------------------->
    @Input() height: any = `50vh`; //50vh | 100vh | 'none'
    @Input() width: any = `50vh`; //50vh | 100vh | 'none'
    @Input() color1: string = "rgba(0, 0, 225, 0.45)";
    @Input() color2: string = "green";
    @Input() color3: string = "red";
    @Input() color4: string = "orange";
    @Input() color5: string = "green";
    @Input() label: string = "Vlad";
    @Input() value?: any = null;

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
                 <cstm-circle-hover-btn (onClick)=someMethodOnPageUsingComponent($event)>
                 </cstm-circle-hover-btn> 
              </ion-content>
    * @description When circleHoverBtn component emits a click event it will
    *							   - emits the value found inside this component(this.value) to any page/component using it
    * @return any
    */
    onClickEvent() {
        this.onClick.emit(this.value);
    }

}
