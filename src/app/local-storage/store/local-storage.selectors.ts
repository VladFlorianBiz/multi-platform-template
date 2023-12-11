//---------------CORE--------------------------------------------------------------------------//
import { createSelector } from '@ngrx/store';
import { AppState } from '../../app.reducer';
//---------------Local Storage State Varaibles ----------------------------------------------------//
export const getLocalStorageShoppingCartState = (state: AppState) => state.localStorage.shoppingCart;


//---------------Local Storage State Selectors------------------------------------------------------//

export const selectLocalStorageShoppingCart = createSelector(
  getLocalStorageShoppingCartState,
  shoppingCart => shoppingCart
);
