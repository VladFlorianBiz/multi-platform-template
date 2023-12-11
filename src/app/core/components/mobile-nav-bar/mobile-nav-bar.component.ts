/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Component, Input, Inject, ChangeDetectionStrategy, SimpleChanges } from '@angular/core';
import { Renderer2} from '@angular/core';
import { DOCUMENT } from '@angular/common'; 

@Component({
  selector: 'app-top-nav-bar',
  templateUrl: './top-nav-bar.component.html',
  styleUrls: ['./top-nav-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class TopNavBarComponent {
  //-- Inputs -----------------------
  @Input() elementId: string = 'navbarElement';
  @Input() expandNavbar: boolean = false;

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.expandNavbar.firstChange) {
      // only logged upon a change after rendering
      const addOrRemoveClassEventParam = { 
        elementId: this.elementId, 
        className: "expand-navbar", 
        addClassFlag: changes.expandNavbar.currentValue == true, 
        removeClassFlag: changes.expandNavbar.currentValue == false 
      }
      this.addOrRemoveClassEvent(addOrRemoveClassEventParam)
    }
  }

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) document: Document
  ) { }

  addOrRemoveClassEvent({ elementId, className, addClassFlag, removeClassFlag }: { elementId: string, className: string, addClassFlag: boolean, removeClassFlag: boolean }) {
    const htmlElement = document.getElementById(elementId);

    if (addClassFlag && !htmlElement.classList.contains(className)) {
      // console.log('##Adding Class', { className, elementId })
      this.renderer.addClass(htmlElement, className);
    }

    if (removeClassFlag && htmlElement.classList.contains(className)) {
      // console.log('##Removing Class', { className, htmlElement })
      this.renderer.removeClass(htmlElement, className);
    }
  }

}
