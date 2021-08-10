import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Ingredient } from "src/app/shared/ingredient.model";
import { ShoppingListService } from "src/app/shopping-list/service/shopping-list.service";
import { Recipe } from "../recipe.model";

@Injectable()
export class RecipeService {

  recipesChanged: Subject<Recipe[]> = new Subject<Recipe[]>();

  private recipes: Recipe[] = [
    new Recipe(
      1,
      'Pineapple cake',
      'Summer garden fruits in a sweet glazed cream',
      'https://images.freeimages.com/images/large-previews/b89/summer-garden-fruits-in-a-sweet-glazed-cream-pie-dessert-1632381.jpg',
      [
        new Ingredient('Pineapple', 5),
        new Ingredient('Muka', 500)
      ]
    ),

    new Recipe(
      2,
      'Apple pie',
      'Apple pie with almonds',
      'https://images.freeimages.com/images/large-previews/815/apple-pie-with-almonds-1318484.jpg',
      [
        new Ingredient('Apple', 5),
        new Ingredient('Muka', 500)
      ]
    )
  ];

  constructor(private shoppingListService: ShoppingListService) {}

  getRecipes(): Recipe[] {
    return this.recipes.slice(); // The aim is to return the copy of the recipes in order to prevent changing it out of this service
  }

  generateId(): number {
    const ids: number[] = [];
    for (const recipe of this.recipes) {
      ids.push(recipe.id);
    }
    return (Math.max(...ids) + 1);
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]): void {
    if (ingredients && ingredients.length > 0) {
      ingredients.forEach(ingredient => {
        this.shoppingListService.addNewIngredient(ingredient);
      })
    }
  }

  getRecipe(id: number): Recipe {
    return this.recipes.find(recipe => recipe.id === id);
  }

  addRecipe(recipe: Recipe): void {
    this.recipes.push(recipe);
    this.notidyRecipesChanged();
  }

  updateRecipe(recipeUpd: Recipe): void {
    for (let index = 0; index < this.recipes.length; index++) {
      const recipe: Recipe = this.recipes[index];
      if (recipeUpd.id === recipe.id) {
        this.recipes[index] = recipeUpd;
        break;
      }
    }
    this.notidyRecipesChanged();
  }

  private notidyRecipesChanged(): void {
    this.recipesChanged.next(this.getRecipes());
  }

}
