/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Component, EventEmitter, Input, Output } from "@angular/core";
//-- **Data Models** ----------------------------------------------------------------------------//
//-- **Helpers/Services** -----------------------------------------------------------------------//

@Component({
    selector: 'cstm-moving-circle-title',
    templateUrl: './moving-circle-title.component.html',
    styleUrls: ['./moving-circle-title.component.scss'],
})

/**
 * @export
 * @component MovingCircleTitleComponent
 * @example <ion-content>
      <cstm-moving-circle-title   (onClick)=someMethodOnPageUsingComponent($event)
                      height="250px" 
                      width="250px" 
                      [value]="someVariableOnPage"
                      [imageUrl]="someVariableOnPage" >
      </cstm-moving-circle-title> 
   </ion-content>
 */
export class MovingCircleTitleComponent  {
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
    *							- Helpers: UiHelper, MovingCircleTitleDataObjHelper, FirebaseHelper
    *							- Services: MovingCircleTitleService
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
*							- Can be used to subscribe to movingCircleTitle selectors(movingCircleTitle state variables/observable streams) 
*							- Make sure you destroy any subscribed to streams on page destroy or else memory leaks can occur
* @return void
*/
    ngOnInit(): void {

    }

    /**
    * @method onClickEvent
    * @example <ion-content>
                 <cstm-moving-circle-title (onClick)=someMethodOnPageUsingComponent($event)>
                 </cstm-moving-circle-title>
              </ion-content>
    * @description When MovingCircleTitleComponent emits a click event it will
    *							   - emits the value found inside this component(this.value) to any page/component using it
    * @return any
    */
    onClickEvent() {
        this.onClick.emit(this.value);
    }

}
