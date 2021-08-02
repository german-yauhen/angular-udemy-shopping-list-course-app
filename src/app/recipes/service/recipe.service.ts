import { EventEmitter, Injectable } from "@angular/core";
import { Ingredient } from "src/app/shared/ingredient.model";
import { ShoppingListService } from "src/app/shopping-list/service/shopping-list.service";
import { Recipe } from "../recipe.model";

@Injectable()
export class RecipeService {

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

  recipeSelected: EventEmitter<Recipe> = new EventEmitter<Recipe>();

  constructor(private shoppingListService: ShoppingListService) {}

  getRecipes(): Recipe[] {
    return this.recipes.slice(); // The aim is to return the copy of the recipes in order to prevent changing it out of this service
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

}
