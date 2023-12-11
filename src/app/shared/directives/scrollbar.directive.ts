import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[scrollbarStyle]'
})
export class ScrollbarStyleDirective implements OnInit {
  defaultScrollbarStyle = `@media(pointer: fine) {
        ::-webkit-scrollbar {
          width: 12px;
        }
        ::-webkit-scrollbar-track {
          -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
          background-color: #141418; 
        }
        ::-webkit-scrollbar-track:hover {
          background-color: #23232e; 
        }
        ::-webkit-scrollbar-thumb {
          -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
          background-color: var(--ion-color-primary);
          border-radius: 4px;
        }
          ::-webkit-scrollbar-thumb:hover {
          background-color: var(--ion-color-primary-tint);
          ::-webkit-scrollbar-track {
            background-color: #23232e; 
          }
        }
        .inner-scroll {
          scrollbar-width: thin
        }
      }`;
  @Input() customScrollBarStyle: string = undefined;

  hostElement: HTMLElement

  constructor(public elementRef: ElementRef) { }

  ngOnInit() {
    this.hostElement = this.elementRef.nativeElement
    if (this.hostElement && this.hostElement.tagName && this.hostElement.tagName == 'ION-CONTENT') {
      let el = document.createElement('style')
      el.innerText = this.customScrollBarStyle ?? this.defaultScrollbarStyle;
      this.hostElement.shadowRoot.appendChild(el)
    }
  }

}