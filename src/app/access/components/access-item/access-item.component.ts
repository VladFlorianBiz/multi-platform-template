/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Component, EventEmitter, Input, Output, SimpleChanges, OnChanges } from "@angular/core";
//-- **Data Models** ----------------------------------------------------------------------------//
import { AccessDb, initialAccessDb } from './../../models/access.model';
import { MediaDb, mediaTypeOptions } from './../../../media/models/media.model';
//-- **Helpers/Services** -----------------------------------------------------------------------//

@Component({
    selector: 'cstm-access-item',
    templateUrl: './access-item.component.html',
    styleUrls: ['./access-item.component.scss'],
})

/**
 * @export
 * @component AccessItemComponent
 * @example <ion-content>
      <cstm-access-item  (onClick)=someMethodOnPageUsingComponent($event)
                      [name]="someVariableOnPageUsingComponent1" 
                      [description]="someVariableOnPageUsingComponent2" 
                      [access]="accessVariableOnPageUsingComponent">
      </cstm-access-item> 
   </ion-content>
 */
export class AccessItemComponent implements OnChanges {
    //---------------------------------------------------------->
    //-- Inputs ------------------------------------------------>
    @Input() name: string = '';
    @Input() description: string = '';
    @Input() access?: AccessDb = { ...initialAccessDb };
    @Input() media?: MediaDb[] = [];
    src = '/../../assets/images/no-photo.png';

    //------------------------------------------>
    //-- Outputs ------------------------------->
    @Output() onClick = new EventEmitter<any>();


    /************************************************************************************
    * @constructor Component Constructor
    * @description  Initialize Class and Dependencies(Imports), see SOME examples below.
    *							- Helpers: UiHelper, AccessDataObjHelper, FirebaseHelper
    *							- Services: AccessService
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
        const hasAccessChanges = changes['access']
        const hasMediaChanges = changes['media']
        // console.log('changes', changes)

        
        //------------------------------------------------------------------------------------------------------------------------------------------------------>
        if (hasAccessChanges && hasMediaChanges) {
            const access: AccessDb = { ...changes?.access?.currentValue };
            const media: MediaDb[] = [...changes?.media?.currentValue];
            const unlinkedMediaThatHasDownloadUrl = media?.filter(item => item?.downloadUrl?.length > 0 && item?.type === mediaTypeOptions.accessMainMedia);
            const hasUnlinkedMedia = unlinkedMediaThatHasDownloadUrl?.length > 0;
            const linkedMainMedia = access?.linkedMedia.filter(item => item?.downloadUrl?.length > 0 && item?.type === mediaTypeOptions.accessMainMedia);
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
        else if (hasAccessChanges && !hasMediaChanges) {

            //---------------
            const access: AccessDb = { ...changes?.access?.currentValue };
            const linkedMainMedia = access?.linkedMedia.filter(item => item?.downloadUrl?.length > 0 && item?.type === mediaTypeOptions.accessMainMedia);
            const hasLinkedMainMediaFlag = linkedMainMedia?.length > 0;

            if (hasLinkedMainMediaFlag) {
                this.src = linkedMainMedia[0]?.downloadUrl
            } else {
                this.src = '/../../assets/images/no-photo.png'
            }
        }
        //------------------------------------------------------------------------------------------------------------------------------------------------------>
        else if (hasMediaChanges && !hasAccessChanges) {
            //---------------
            const media: MediaDb[] = [...changes?.media?.currentValue];
            const unlinkedMainMedia = media?.filter(item => item?.downloadUrl?.length > 0 && item?.type === mediaTypeOptions.accessMainMedia);
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
                 <cstm-access-item (onClick)=someMethodOnPageUsingComponent($event)>
                 </cstm-access-item> 
              </ion-content>
    * @description When accessItem component emits a click event it will
    *							   - emits the value found inside this component(this.access) to any page/component using it
    * @return any
    */
    onClickEvent() {
        this.onClick.emit(this.access);
    }

}
