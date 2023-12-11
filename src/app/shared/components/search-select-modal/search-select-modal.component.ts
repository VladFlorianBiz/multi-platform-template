//-------------- Core -------------------------------------------------------//
import { Component, OnInit, Input, Output, EventEmitter  } from "@angular/core";
//------------- Services/Helpers -------------------------------------------//



@Component({
  selector: "cstm-search-select-modal",
  templateUrl: "./search-select-modal.component.html",
  styleUrls: ["./search-select-modal.component.scss"],
})
export class SearchSelectModalComponent implements OnInit {
  //-- Core  -------------------------------------------------->
  //-- Main Vars ----------------------->
  filteredItems: any[] = [];
  localSelectedItems: any[] = [];
  searchQuery = '';

  //-- Inputs --------------------------->
  @Input() items: any[] = [];
  @Input() selectedItems: string[] = [];
  @Input() title = 'Select Items';
  @Input() isSelectManyMode = false;

  //-- Outputs -------------------------------------------->
  @Output() selectionCancel = new EventEmitter<void>();
  @Output() selectionChange = new EventEmitter<string[]>();

  constructor(

    ) { }


  ngOnInit() {
    this.filteredItems = [...this.items];
    this.localSelectedItems = [...this.selectedItems];
  }

  trackItems(index: number, item: any) {
    return item.id;
  }


  filterItems(allItems) {
    if (this.searchQuery.trim() !== '') {
      this.filteredItems = [...allItems.filter(item => {
        const filterResult = item.name.toLowerCase().indexOf(this.searchQuery.toLowerCase()) !== -1
        return filterResult;
      })];
    }
    else {
      this.filteredItems = [...allItems];
    }
  }

  // Select Item -------------------------------------------------------------------------------------------->
  selectItem(item) {
    const itemIsSelected = this.isItemSelected(item)
    if (itemIsSelected) {
      this.localSelectedItems = this.localSelectedItems.filter(selectedItem => selectedItem.id !== item.id);
    } else {
      const newItem = { ...item };
      this.localSelectedItems = (this.isSelectManyMode) ? [...this.localSelectedItems, { ...newItem }] : [{...newItem}];
    }
  }


  // Check if Item Is selected ------------------------------------------->
  isItemSelected(_item) {
    return this.localSelectedItems.some(item => item.id == _item.id);
  }



  dismissModal() {
    this.selectionCancel.emit();
  }

  save() {
    this.selectionChange.emit(this.localSelectedItems);
  }





}
