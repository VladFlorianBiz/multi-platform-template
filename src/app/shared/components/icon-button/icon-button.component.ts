/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "icon-button",
  templateUrl: "./icon-button.component.html",
  styleUrls: ["./icon-button.component.scss"]
})
export class IconButtonComponent {
  //-- Inputs -----------------------
  @Input() label: string = '';
  @Input() initials: string = '';
  @Input() activeIconUrl: string;
  @Input() inactiveIconUrl: string;
  @Input() iconUrl: string;
  @Input() active: boolean;
  @Input() value: any;
  @Input() height: number = 120;
  @Input() textColor: string = 'white';

  @Input() width: number = 150;
  @Input() cornerText: string = null;

  //-- Outputs -----------------------
  @Output() onButtonClick = new EventEmitter<any>();

  constructor() { }

  buttonClick() {
    this.onButtonClick.emit(this.value)
  }

}