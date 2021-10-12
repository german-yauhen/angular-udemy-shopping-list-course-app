import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Subject } from "rxjs";
import { Ingredient } from "src/app/shared/ingredient.model";
import { Recipe } from "../recipe.model";
import * as ShoppingListActions from "../../shopping-list/store/shopping-list-actions";
import * as fromApp from "../../store/app.reducer";

@Injectable()
export class RecipeService {

  recipesChanged: Subject<Recipe[]> = new Subject<Recipe[]>();

  private recipes: Recipe[] = [];

  constructor(private store: Store<fromApp.AppState>) {}

  getRecipes(): Recipe[] {
    return this.recipes.slice(); // The aim is to return the copy of the recipes in order to prevent changing it out of this service
  }

  setRecipes(recipes: Recipe[]): void {
    this.recipes = recipes;
    this.notifyRecipesChanged();
  }

  generateId(): number {
    if (this.recipes.length == 0) {
      return 1;
    }
    const ids: number[] = [];
    for (const recipe of this.recipes) {
      ids.push(recipe.id);
    }
    return Math.max(...ids) + 1;
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]): void {
    if (ingredients && ingredients.length > 0) {
      this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
    }
  }

  getRecipe(id: number): Recipe {
    return this.recipes.find(recipe => recipe.id === id);
  }

  addRecipe(recipe: Recipe): void {
    this.recipes.push(recipe);
    this.notifyRecipesChanged();
  }

  updateRecipe(recipeUpd: Recipe): void {
    const foundIndex: number = this.findRecipeIndex(recipeUpd.id);
    this.recipes[foundIndex] = recipeUpd;
    this.notifyRecipesChanged();
  }

  deleteRecipe(recipeId: number): void {
    const foundIndex: number = this.findRecipeIndex(recipeId);
    this.recipes.splice(foundIndex, 1);
    this.notifyRecipesChanged();
  }

  private findRecipeIndex(recipeId: number): number {
    let found: number;
    for (let index = 0; index < this.recipes.length; index++) {
      const recipe: Recipe = this.recipes[index];
      if (recipeId === recipe.id) {
        found = index;
        break;
      }
    }
    return found;
  }

  private notifyRecipesChanged(): void {
    this.recipesChanged.next(this.getRecipes());
  }

}
