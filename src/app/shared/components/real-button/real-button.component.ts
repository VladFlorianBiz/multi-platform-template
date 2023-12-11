/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: 'cstm-real-button',
  templateUrl: './real-button.component.html',
  styleUrls: ['./real-button.component.scss'],
})
export class RealButtonComponent {
  //-- Inputs ---------------->
  @Input() label: string = '';
  @Input() value: any;
  @Input() padding: any = `1em 1em`;

  //-- Outputs ------------------------------------->
  @Output() onButtonClick = new EventEmitter<any>();
  constructor() { }

  buttonClick() {
    this.onButtonClick.emit(this.value)
  }

}
