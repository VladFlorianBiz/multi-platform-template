/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Component, Input } from "@angular/core";
//-- **Data Models** ----------------------------------------------------------------------------//
//-- **Helpers/Services** -----------------------------------------------------------------------//

@Component({
    selector: 'cstm-glowing-text',
    templateUrl: './glowing-text.component.html',
    styleUrls: ['./glowing-text.component.scss'],
})
    /**
     * @export
     * @component GlowingTextComponent
     * @example <ion-content>
          <cstm-glowing-text
                          glowRadius="50px" 
                          backgroundColor="#222" 
                          fontSize="10vw"
                          height="none"
                          color1="cyan"
                          color2="yellow"
                          color3="tomato"
                          text="Vlad">
          </cstm-glowing-text> 
       </ion-content>
     */
export class GlowingTextComponent {
    @Input() glowRadius: string = '50px';
    @Input() backgroundColor: string = '#222';
    @Input() fontSize: any = `10vw`;
    @Input() height: any = `none`; //100vh | 'none'
    @Input() color1: string = "cyan";
    @Input() color2: string = "yellow";
    @Input() color3: string = "tomato";
    @Input() text: string = "Vlad";
}
