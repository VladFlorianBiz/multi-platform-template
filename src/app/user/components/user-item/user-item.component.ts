/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Component, EventEmitter, Input, Output, SimpleChanges, OnChanges } from "@angular/core";
//-- **Data Models** ----------------------------------------------------------------------------//
import { UserDb, initialUserDb } from './../../models/user.model';
import { MediaDb, mediaTypeOptions } from './../../../media/models/media.model';
//-- **Helpers/Services** -----------------------------------------------------------------------//

@Component({
    selector: 'cstm-user-item',
    templateUrl: './user-item.component.html',
    styleUrls: ['./user-item.component.scss'],
})

/**
 * @export
 * @component UserItemComponent
 * @example <ion-content>
      <cstm-user-item  (onClick)=someMethodOnPageUsingComponent($event)
                      [name]="someVariableOnPageUsingComponent1" 
                      [description]="someVariableOnPageUsingComponent2" 
                      [user]="userVariableOnPageUsingComponent">
      </cstm-user-item> 
   </ion-content>
 */
export class UserItemComponent implements OnChanges {
    //---------------------------------------------------------->
    //-- Inputs ------------------------------------------------>
    @Input() name: string = '';
    @Input() description: string = '';
    @Input() user?: UserDb = { ...initialUserDb };
    @Input() media?: MediaDb[] = [];
    src = '/../../assets/images/no-photo.png';

    //------------------------------------------>
    //-- Outputs ------------------------------->
    @Output() onClick = new EventEmitter<any>();


    /************************************************************************************
    * @constructor Component Constructor
    * @description  Initialize Class and Dependencies(Imports), see SOME examples below.
    *							- Helpers: UiHelper, UserDataObjHelper, FirebaseHelper
    *							- Services: UserService
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


    ngOnChanges(changes: SimpleChanges): void {
        const hasUserChanges = changes['user']
        const hasMediaChanges = changes['media']
        // console.log('changes', changes)

        
        //------------------------------------------------------------------------------------------------------------------------------------------------------>
        if (hasUserChanges && hasMediaChanges) {
            const user: UserDb = { ...changes?.user?.currentValue };
            const media: MediaDb[] = [...changes?.media?.currentValue];
            const unlinkedMediaThatHasDownloadUrl = media?.filter(item => item?.downloadUrl?.length > 0 && item?.type === mediaTypeOptions.userMainMedia);
            const hasUnlinkedMedia = unlinkedMediaThatHasDownloadUrl?.length > 0;
            const linkedMainMedia = user?.linkedMedia.filter(item => item?.downloadUrl?.length > 0 && item?.type === mediaTypeOptions.userMainMedia);
            const hasLinkedMedia = linkedMainMedia?.length > 0;
          if (hasLinkedMedia) { 
                this.src = linkedMainMedia[0]?.downloadUrl
            }
            
          else if (hasUnlinkedMedia) {
                this.src = unlinkedMediaThatHasDownloadUrl[0]?.downloadUrl
            }  
            else {
                this.src = '/../../assets/images/no-photo.png'
            }
        }
        //------------------------------------------------------------------------------------------------------------------------------------------------------>
        else if (hasUserChanges && !hasMediaChanges) {

            //---------------
            const user: UserDb = { ...changes?.user?.currentValue };
            const linkedMainMedia = user?.linkedMedia.filter(item => item?.downloadUrl?.length > 0 && item?.type === mediaTypeOptions.userMainMedia);
            const hasLinkedMainMediaFlag = linkedMainMedia?.length > 0;

            if (hasLinkedMainMediaFlag) {
                this.src = linkedMainMedia[0]?.downloadUrl
            } else {
                this.src = '/../../assets/images/no-photo.png'
            }
        }
        //------------------------------------------------------------------------------------------------------------------------------------------------------>
        else if (hasMediaChanges && !hasUserChanges) {
            //---------------
            const media: MediaDb[] = [...changes?.media?.currentValue];
            const unlinkedMainMedia = media?.filter(item => item?.downloadUrl?.length > 0 && item?.type === mediaTypeOptions.userMainMedia);
            const hasUnlinkedMainMediaFlag = unlinkedMainMedia?.length > 0;

            if (hasUnlinkedMainMediaFlag) {
                this.src = unlinkedMainMedia[0]?.downloadUrl
            } 
             else {
                this.src = '/../../assets/images/no-photo.png'
            }
        }
    }

    /**
    * @method onClickEvent
    * @example <ion-content>
                 <cstm-user-item (onClick)=someMethodOnPageUsingComponent($event)>
                 </cstm-user-item> 
              </ion-content>
    * @description When userItem component emits a click event it will
    *							   - emits the value found inside this component(this.user) to any page/component using it
    * @return any
    */
    onClickEvent() {
        this.onClick.emit(this.user);
    }

}
