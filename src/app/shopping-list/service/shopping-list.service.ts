// import { EventEmitter } from "@angular/core";
import { Subject } from "rxjs";
import { Ingredient } from "src/app/shared/ingredient.model";

export class ShoppingListService {

  // ingredientChanged: EventEmitter<Ingredient[]> = new EventEmitter<Ingredient[]>();
  ingredientChanged: Subject<Ingredient[]> = new Subject<Ingredient[]>();

  startedEditing: Subject<number> = new Subject<number>();

  private ingredients: Ingredient[] = [
    new Ingredient('Apple', 3),
    new Ingredient('Pineapple', 2),
    new Ingredient('Diamond milk', 500)
  ];

  getIngredients(): Ingredient[] {
    return this.getIngredientsCopy();
  }

  getIngredient(index: number): Ingredient {
    return this.ingredients[index];
  }

  addNewIngredient(newIngredient: Ingredient): void {
    const existedIngredient: Ingredient = this.getIngredientByName(newIngredient.name);
    if (existedIngredient) {
      existedIngredient.amount = existedIngredient.amount + newIngredient.amount;
    } else {
      this.ingredients.push(newIngredient);
    }
    this.emitIngredientChanged();
  }

  addNewIngredients(ingredients: Ingredient[]): void {
    this.ingredients.push(...ingredients);
    this.emitIngredientChanged();
  }

  deleteIngredient(index: number): void {
    this.ingredients.splice(index, 1);
    this.ingredientChanged.next(this.getIngredientsCopy());
  }

  private emitIngredientChanged(): void {
    this.ingredientChanged.next(this.getIngredientsCopy());
  }

  private getIngredientsCopy(): Ingredient[] {
    return this.ingredients.slice();
  }

  private getIngredientByName(name: string): Ingredient {
    return this.ingredients.find(ingredient => ingredient.name.toUpperCase() === name.toUpperCase());
  }

}
