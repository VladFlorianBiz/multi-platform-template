/*************************************************************************************************
 ** Imports                                                                                     **
 **************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { NgModule } from '@angular/core';
//-- **Angular Material Ui Modules** ------------------------------------------------------------//
// import { MatInputModule } from '@angular/material/input';
// import { MatRippleModule } from '@angular/material/core';
// import { MatSelectModule } from '@angular/material/select';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatTooltipModule } from '@angular/material/tooltip';
// import { MatExpansionModule } from '@angular/material/expansion';
// import { MatListModule } from '@angular/material/list';
// import { MatSortModule } from '@angular/material/sort';
// import { MatPaginatorModule } from '@angular/material/paginator';
// import { MatChipsModule } from '@angular/material/chips';
// import { MatIconModule } from '@angular/material/icon';

const components = [
    // MatInputModule,
    // MatRippleModule,
    // MatSelectModule,
    // MatFormFieldModule,
    // MatExpansionModule,
    // MatListModule,
    // MatSortModule,
    // MatPaginatorModule,
    // MatTooltipModule,
    // MatChipsModule,
    // MatIconModule
]
@NgModule({
    imports: [
        ...components
    ],
    exports: [
        ...components
    ]
})
export class AngularMaterialUIModule { }

