/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Component, EventEmitter, Input, Output } from "@angular/core";
//-- **Data Models** ----------------------------------------------------------------------------//
//-- **Helpers/Services** -----------------------------------------------------------------------//

@Component({
    selector: 'cstm-animated-blob-btn',
    templateUrl: './animated-blob-btn.component.html',
    styleUrls: ['./animated-blob-btn.component.scss'],
})

/**
 * @export
 * @component AnimatedBlobBtnComponent
 * @example <ion-content>
      <cstm-animated-blob-btn  (onClick)=someMethodOnPageUsingComponent($event)
                      [name]="someVariableOnPageUsingComponent1" 
                      [description]="someVariableOnPageUsingComponent2"
                      [value]="someVariableOnPage"
                      [downloadUrl]="someVariableOnPage" 
                      [animatedBlobBtn]="animatedBlobBtnVariableOnPageUsingComponent">
      </cstm-animated-blob-btn> 
   </ion-content>
 */
export class AnimatedBlobBtnComponent  {
    //---------------------------------------------------------->
    //-- Inputs ------------------------------------------------>
    @Input() value?: any = {};
    @Input() height?: any = `200px`; //200px | 100vh | 'none'
    @Input() width?: any = `200px`; //200px | 100vh | 'none'
    @Input() backgroundColor?: string = "black";
    @Input() hoverColor?: string = "#393636";

    //------------------------------------------>
    //-- Outputs ------------------------------->
    @Output() onClick = new EventEmitter<any>();



    /************************************************************************************
    * @constructor Component Constructor
    * @description  Initialize Class and Dependencies(Imports), see SOME examples below.
    *							- Helpers: UiHelper, AnimatedBlobBtnDataObjHelper, FirebaseHelper
    *							- Services: AnimatedBlobBtnService
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
* @method ngOnInit
* @description Angular page life cycle method that runs after class and its dependencies have been initialized.
*							Imports are available to be used at this point
*							- can be used to initialize form
*							- Can be used to subscribe to animatedBlobBtn selectors(animatedBlobBtn state variables/observable streams) 
*							- Make sure you destroy any subscribed to streams on page destroy or else memory leaks can occur
* @return void
*/
    ngOnInit(): void {

    }

    /**
    * @method onClickEvent
    * @example <ion-content>
                 <cstm-animated-blob-btn (onClick)=someMethodOnPageUsingComponent($event)>
                 </cstm-animated-blob-btn>
              </ion-content>
    * @description When AnimatedBlobBtnComponent emits a click event it will
    *							   - emits the value found inside this component(this.value) to any page/component using it
    * @return any
    */
    onClickEvent() {
        this.onClick.emit(this.value);
    }

}
