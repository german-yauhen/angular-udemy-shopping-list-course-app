import { EventEmitter } from "@angular/core";
import { Ingredient } from "src/app/shared/ingredient.model";

export class ShoppingListService {

  ingredientChanged: EventEmitter<Ingredient[]> = new EventEmitter<Ingredient[]>();

  private ingredients: Ingredient[] = [
    new Ingredient('Apple', 3),
    new Ingredient('Pineapple', 2),
    new Ingredient('Diamond milk', 500)
  ];

  getIngredients(): Ingredient[] {
    return this.getIngredientsCopy();
  }

  addNewIngredient(newIngredient: Ingredient): void {
    const existedIngredient: Ingredient = this.getIngredientByName(newIngredient.name);
    if (existedIngredient) {
      existedIngredient.amount = existedIngredient.amount + newIngredient.amount;
    } else {
      this.ingredients.push(newIngredient);
    }
    this.ingredientChanged.emit(this.getIngredientsCopy());
  }

  private getIngredientsCopy(): Ingredient[] {
    return this.ingredients.slice();
  }

  private getIngredientByName(name: string): Ingredient {
    return this.ingredients.find(ingredient => ingredient.name.toUpperCase() === name.toUpperCase());
  }

}
