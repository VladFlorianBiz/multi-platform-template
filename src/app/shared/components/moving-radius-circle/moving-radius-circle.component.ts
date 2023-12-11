/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Component, EventEmitter, Input, Output } from "@angular/core";
//-- **Data Models** ----------------------------------------------------------------------------//
//-- **Helpers/Services** -----------------------------------------------------------------------//

@Component({
    selector: 'cstm-moving-radius-circle',
    templateUrl: './moving-radius-circle.component.html',
    styleUrls: ['./moving-radius-circle.component.scss'],
})

/**
 * @export
 * @component MovingRadiusCircleComponent
 * @example <ion-content>
      <cstm-moving-radius-circle  (onClick)=someMethodOnPageUsingComponent($event)
                      height="250px" 
                      width="250px" 
                      [value]="someVariableOnPage"
                      [imageUrl]="someVariableOnPage" 
                    >
      </cstm-moving-radius-circle> 
   </ion-content>
 */
export class MovingRadiusCircleComponent  {
    //---------------------------------------------------------->
    //-- Inputs ------------------------------------------------>
    @Input() imageUrl?: string = 'https://images.unsplash.com/photo-1547542928-dd9bc5371279?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjE0NTg5fQ';
    @Input() height?: any = `250px`; //250px | 100vh | 'none'
    @Input() width?: any = `250px`; //250px | 100vh | 'none'
    @Input() value?: any = {};
    //------------------------------------------>
    //-- Outputs ------------------------------->
    @Output() onClick = new EventEmitter<any>();



    /************************************************************************************
    * @constructor Component Constructor
    * @description  Initialize Class and Dependencies(Imports), see SOME examples below.
    *							- Helpers: UiHelper, MovingRadiusCircleDataObjHelper, FirebaseHelper
    *							- Services: MovingRadiusCircleService
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
*							- Can be used to subscribe to movingRadiusCircle selectors(movingRadiusCircle state variables/observable streams) 
*							- Make sure you destroy any subscribed to streams on page destroy or else memory leaks can occur
* @return void
*/
    ngOnInit(): void {

    }

    /**
    * @method onClickEvent
    * @example <ion-content>
                 <cstm-moving-radius-circle (onClick)=someMethodOnPageUsingComponent($event)>
                 </cstm-moving-radius-circle>
              </ion-content>
    * @description When MovingRadiusCircleComponent emits a click event it will
    *							   - emits the value found inside this component(this.value) to any page/component using it
    * @return any
    */
    onClickEvent() {
        this.onClick.emit(this.value);
    }

}
