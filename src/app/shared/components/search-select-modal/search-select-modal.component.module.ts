//---------------CORE--------------------------------------------------------------------------//
import { NgModule } from "@angular/core";
import { SharedModule } from '../../shared.module';
//---------------COMPONENTS/PAGES--------------------------------------------------------------//
import { SearchSelectModalComponent } from './search-select-modal.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [SearchSelectModalComponent]
})
export class SearchSelectModalComponentModule {}
