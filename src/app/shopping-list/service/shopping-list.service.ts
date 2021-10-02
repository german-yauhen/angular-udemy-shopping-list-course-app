import { Injectable } from "@angular/core";
import { Action, Store } from "@ngrx/store";
import { Subject } from "rxjs";
import { Ingredient } from "src/app/shared/ingredient.model";
import * as ShoppingListActions from "../store/shopping-list-actions";

@Injectable()
export class ShoppingListService {

  ingredientChanged: Subject<Ingredient[]> = new Subject<Ingredient[]>();

  startedEditing: Subject<number> = new Subject<number>();

  constructor(private store: Store<{ shoppingList: { ingredients: Ingredient[] } }>) {}

  getIngredient(index: number): Ingredient {
    let ingredient: Ingredient;
    this.store.select('shoppingList').subscribe(payload => {
      ingredient = payload.ingredients[index];
    })
    return ingredient;
  }

  addOrUpdateIngredient(ingredient: Ingredient): void {
    const existingIngredient: Ingredient = this.findIngredient(ingredient.name);
    const action: Action = existingIngredient
      ? new ShoppingListActions.UpdateIngredient(ingredient)
      : new ShoppingListActions.AddIngredient(ingredient);
    this.store.dispatch(action);
  }

  deleteIngredient(index: number): void {
    const ingredient: Ingredient = this.getIngredient(index);
    this.store.dispatch(new ShoppingListActions.DeleteIngredient(ingredient));
  }

  private findIngredient(name: string): Ingredient {
    let found: Ingredient;
    this.store.select('shoppingList').subscribe(payload => {
      found = payload.ingredients.find(ingr => ingr.name.toUpperCase() === name.toUpperCase());
    });
    return found;
  }

}
