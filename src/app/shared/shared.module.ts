/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
//-- **Component Modules** ----------------------------------------------------------------------//
import { ComponentsModule } from './components/components.module';
/**********************************************************************************************************************************
** Shared Module                                                                                                                 **
**  - This Module should be imported into any page/component                                                                     **
**  - Imports Common Angular functions via CommonModule: <div *ngIf="conditionVariable">  <div *ngFor="let item of itemList;">   **
**  - Imports Angular routing(navigating from one page to another) via RouterModule: <a routerLink="url">, <router-outlet>       **
**  - Imports Angular reactive forms via ReactiveFormsModule and FormsModule that provides FormBuilder, FormGroup, Validators    **
**  - Imports Ionic UI Components + functionality via IonicModule                                                                **
**  - Imports Shared Custom Components library inside components.module.ts                                                       **
**  - Imports any additional Shared Modules/Functionality such as additional Ui Libraries i..e AngularMaterial                   **
***********************************************************************************************************************************/

@NgModule({
  declarations: [
  ],
  imports: [
    //-- Core ------------>
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule, 
    HttpClientModule,
    //-- Components ->
    ComponentsModule,
  ],
  exports: [
    IonicModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
  ],
})
export class SharedModule { }
