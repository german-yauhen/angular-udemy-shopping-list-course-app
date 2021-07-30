import { EventEmitter } from "@angular/core";
import { Recipe } from "../recipe.model";

export class RecipeService {

  private recipes: Recipe[] = [
    new Recipe('Pineapple cake', 'Summer garden fruits in a sweet glazed cream', 'https://images.freeimages.com/images/large-previews/b89/summer-garden-fruits-in-a-sweet-glazed-cream-pie-dessert-1632381.jpg'),
    new Recipe('Apple pie', 'Apple pie with almonds', 'https://images.freeimages.com/images/large-previews/815/apple-pie-with-almonds-1318484.jpg')
  ];

  recipeSelected: EventEmitter<Recipe> = new EventEmitter<Recipe>();

  getRecipes(): Recipe[] {
    return this.recipes.slice(); // The aim is to return the copy of the recipes in order to prevent changing it out of this service
  }

}
