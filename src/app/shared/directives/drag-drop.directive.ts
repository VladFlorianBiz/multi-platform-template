/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Directive, Output, Input, EventEmitter, HostBinding, HostListener } from '@angular/core';

@Directive({
    selector: '[appDragDrop]'
})
export class DragDropDirective {

    @Output() onFileDropped = new EventEmitter<FileList>();

    @HostBinding('style.background-color') private background = '#f5fcff'
    @HostBinding('style.opacity') private opacity = '1'

    //Dragover listener
    @HostListener('dragover', ['$event']) 
    onDragOver(evt) {
        evt.preventDefault();
        // evt.stopPropagation();
        this.background = '#9ecbec';
        this.opacity = '0.8'
    }

    //Dragleave listener
    @HostListener('dragleave', ['$event']) 
    onDragLeave(evt) {
        evt.preventDefault();
        // evt.stopPropagation();
        this.background = '#f5fcff'
        this.opacity = '1'
    }

    //Drop listener
    @HostListener('drop', ['$event']) 
    ondrop(evt) {
        evt.preventDefault();
        // evt.stopPropagation();
        this.background = '#f5fcff'
        this.opacity = '1'
        let files = evt.dataTransfer.files;
        this.onFileDropped.emit(files)
    }

}