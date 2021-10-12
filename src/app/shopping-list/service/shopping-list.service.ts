import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable, Subject } from "rxjs";
import { Ingredient } from "src/app/shared/ingredient.model";
import * as ShoppingListActions from "../store/shopping-list-actions";
import * as fromShoppingList from "../store/shopping-list.reducer";
import * as fromApp from "../../store/app.reducer";

@Injectable()
export class ShoppingListService {

  startedEditing: Subject<string> = new Subject<string>();

  constructor(private store: Store<fromApp.AppState>) {}

  addIngredient(ingredient: Ingredient): void {
    const existingIngredient: Ingredient = this.findIngredient(ingredient.name);
    if (existingIngredient) {
      this.updateIngredient(new Ingredient(existingIngredient.name, existingIngredient.amount + ingredient.amount));
    } else {
      this.store.dispatch(new ShoppingListActions.AddIngredient(ingredient));
    }
  }

  updateIngredient(ingredient: Ingredient): void {
    this.store.dispatch(new ShoppingListActions.UpdateIngredient(ingredient));
  }

  deleteIngredient(): void {
    this.store.dispatch(new ShoppingListActions.DeleteIngredient());
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

  getShoppingListSate(): Observable<fromShoppingList.ShoppingListState> {
    return this.store.select('shoppingList');
  }

}
