/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


//-- **Shared Components** ----------------------------------------------------------------------//
import { IconButtonComponent } from './icon-button/icon-button.component';
import { RealButtonComponent } from './real-button/real-button.component';
import { FileManagerComponent } from './file-manager/file-manager.component';
import { FileItemComponent } from './file-item/file-item.component';
import { ItemCardComponent } from './item-card/item-card.component';
import { CircleBlurBackgroundComponent } from './circle-blur-background/circle-blur-background.component';
import { WavesBackgroundComponent } from './waves-background/waves-background.component';
import { SnowBackgroundComponent } from './snow-background/snow-background.component';
import { AnimatedTextComponent } from './animated-text/animated-text.component';
import { GlowingTextComponent } from './glowing-text/glowing-text.component';
import { SimpleArtisticBtnComponent } from './simple-artistic-btn/simple-artistic-btn.component';
import { NeonBtnComponent } from './neon-btn/neon-btn.component';
import { CircleHoverBtnComponent } from './circle-hover-btn/circle-hover-btn.component';
import { HoverCardBtnItemComponent } from './hover-card-btn/hover-card-btn-item.component';
import { TypeWriterLabelComponent } from './type-writer-label/type-writer-label.component';
import { AudioPlayerComponent } from './audio-player/audio-player.component';
import { MovingRadiusCircleComponent } from './moving-radius-circle/moving-radius-circle.component';
import { AnimatedBlobBtnComponent } from './animated-blob-btn/animated-blob-btn.component';
import { WavesFullBackgroundComponent } from './waves-full-background/waves-full-background.component';



//-- **Shared Modules** -------------------------------------------------------------------------//
import { IonicModule } from '@ionic/angular';
import { AngularMaterialUIModule } from './../../core/modules/angular-material-ui.module';

//-- **Shared Directives** ----------------------------------------------------------------------//
import { InputDisabledDirective } from '../directives/disable.directive';
import { ScrollbarStyleDirective } from '../directives/scrollbar.directive';
import { NavStretchDirective } from './../directives/nav-stretch.directive';
import { AddOrRemoveClassOnIntersectionDirective } from '../directives/add-or-remove-class-on-intersection.directive';
import { AnimateOnceDirective } from '../directives/animate-once.directive';


//-- **Shared Pipes** ---------------------------------------------------------------------------//
import { FileSizeFormatPipe } from '../pipes/file-size-format.pipe';
import { SearchSelectModalComponent } from './search-select-modal/search-select-modal.component';
import { AiFileItemComponent } from './ai-file-item/ai-file-item.component';
import { MovingCircleTitleComponent } from './moving-circle-title/moving-circle-title.component';
import { PricingComponent } from './pricing/pricing.component';


//-- Shared Module Imports --------->
const sharedModules: Array<any> = [
    AngularMaterialUIModule,
    IonicModule,
];

//-- Shared Directive Declarations --->
const sharedDirectives: Array<any> = [
    InputDisabledDirective,
    ScrollbarStyleDirective,
    NavStretchDirective,
    AddOrRemoveClassOnIntersectionDirective,
    AnimateOnceDirective
];

//-- Shared Pipe Declarations ---->
const sharedPipes: Array<any> = [
    FileSizeFormatPipe,
]


//-- Shared Component Declarations --->
const sharedComponents: Array<any> = [
    IconButtonComponent,
    RealButtonComponent,
    FileManagerComponent,
    FileItemComponent,
    ItemCardComponent,
    CircleBlurBackgroundComponent,
    WavesBackgroundComponent,
    SnowBackgroundComponent,
    AnimatedTextComponent,
    GlowingTextComponent,
    SimpleArtisticBtnComponent,
    NeonBtnComponent,
    CircleHoverBtnComponent,
    HoverCardBtnItemComponent,
    TypeWriterLabelComponent,
    SearchSelectModalComponent,
    AiFileItemComponent,
    AudioPlayerComponent,
    MovingRadiusCircleComponent,
    AnimatedBlobBtnComponent,
    WavesFullBackgroundComponent,
    MovingCircleTitleComponent,
    PricingComponent
];

@NgModule({
    declarations: [
        ...sharedComponents, 
        ...sharedDirectives, 
        ...sharedPipes
    ],
    imports: [
        //-- Imports -------------------------------->
        CommonModule,  //ngIf, *ngFor
        RouterModule,  //routerLink, <router-outlet>
        ReactiveFormsModule,
        FormsModule,
        ...sharedModules
    ],
    exports: [
        ...sharedComponents, 
        ...sharedModules,
        ...sharedDirectives,
    ]
})
export class ComponentsModule { }
