/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Component, Input} from "@angular/core";
//-- **Data Models** ----------------------------------------------------------------------------//
//-- **Helpers/Services** -----------------------------------------------------------------------//

@Component({
    selector: 'cstm-circle-blur-background',
    templateUrl: './circle-blur-background.component.html',
    styleUrls: ['./circle-blur-background.component.scss'],
})

/**
 * @export
 * @component CircleBlurBackgroundComponent
 * @example <ion-content>
      <cstm-circle-blur-background  
                      size="250px"; 
                      mobileSize="500px" 
                      margin="20px"
                      padding="20px"
                      [color1]="`rgba(55, 235, 169, 0.85)`"
                      [color2]="`rgb(91, 55, 235)`"
                      className="container"
                      >
      </cstm-circle-blur-background> 
   </ion-content>
 */
export class CircleBlurBackgroundComponent {
    //-------------------------------------------->
    //-- Inputs ---------------------------------->
    @Input() size: any = `250px`;
    @Input() mobileSize: any = `500px`;
    @Input() padding: any = `0px`;
    @Input() mobilePadding: any = `0px`;
    @Input() margin: any = `0px`;
    @Input() mobileMargin: any = `0px`;
    @Input() color1: any = `rgba(55, 235, 169, 0.85)`;
    @Input() color2: any = `rgb(91, 55, 235)`;
    @Input() className: any = `container`; //e.g.use css class container-top | container

    constructor() {}
}
