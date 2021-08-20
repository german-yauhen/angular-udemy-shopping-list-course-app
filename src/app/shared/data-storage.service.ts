import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/service/recipe.service";
import { map, tap } from "rxjs/operators"

@Injectable({providedIn: 'root'})
export class DataStorageService {

  constructor(private httpClient: HttpClient, private recipeService: RecipeService) {}

  storeRecipes() {
    const recipes: Recipe[] = this.recipeService.getRecipes();
    this.httpClient.put(
      'https://eugenes-ng-course-recipe-book-default-rtdb.firebaseio.com/recipes.json',
      recipes
    ).subscribe(response => {
      console.log(response);
    });
  }

  // storeRecipe(recipe: Recipe): void {
  //   this.httpClient.put(
  //     'https://eugenes-ng-course-recipe-book-default-rtdb.firebaseio.com/recipes.json',
  //     recipe
  //   ).subscribe(response => {
  //     console.log(response);
  //   });
  // }

  fetchRecipes() {
    return this.httpClient
      .get<Recipe[]>('https://eugenes-ng-course-recipe-book-default-rtdb.firebaseio.com/recipes.json')
      .pipe(
        map(recipeResponse => {
          return recipeResponse.map(recipe => {
            return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] };
          })
        }),
        tap(recipes => {
          console.log(recipes);
          this.recipeService.setRecipes(recipes);
        })
      );
  }

}
