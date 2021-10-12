import { Injectable } from "@angular/core";
import { Action, Store } from "@ngrx/store";
import { Observable, Subject } from "rxjs";
import { Ingredient } from "src/app/shared/ingredient.model";
import * as ShoppingListActions from "../store/shopping-list-actions";
import * as fromShoppingList from "../store/shopping-list.reducer";

@Injectable()
export class ShoppingListService {

  startedEditing: Subject<string> = new Subject<string>();

  constructor(private store: Store<fromShoppingList.AppState>) {}

  addOrUpdateIngredient(ingredient: Ingredient): void {
    const existingIngredient: Ingredient = this.findIngredient(ingredient.name);
    const action: Action = existingIngredient
      ? new ShoppingListActions.UpdateIngredient(ingredient)
      : new ShoppingListActions.AddIngredient(ingredient);
    this.store.dispatch(action);
  }

  deleteIngredient(ingredientName: string): void {
    const ingredient: Ingredient = this.findIngredient(ingredientName);
    this.store.dispatch(new ShoppingListActions.DeleteIngredient(ingredient));
  }

  findIngredient(name: string): Ingredient {
    let found: Ingredient;
    this.store.select('shoppingList').subscribe(payload => {
      found = payload.ingredients.find(ingr => ingr.name.toUpperCase() === name.toUpperCase());
    });
    return found;
  }

  startEditingIngredient(name: string): void {
    this.store.dispatch(new ShoppingListActions.StartEditIngredient(name));
  }

  stopEditingIngredient(): void {
    this.store.dispatch(new ShoppingListActions.StopEditIngredient());
  }

  getShoppingListSate(): Observable<fromShoppingList.State> {
    return this.store.select('shoppingList');
  }

}
