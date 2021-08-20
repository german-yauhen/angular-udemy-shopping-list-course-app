import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { DataStorageService } from "src/app/shared/data-storage.service";
import { Recipe } from "../recipe.model";
import { RecipeService } from "./recipe.service";

@Injectable({providedIn: 'root'})
export class RecipesResolverService implements Resolve<Recipe[]> {

  constructor(private dataStorageService: DataStorageService, private recipeService: RecipeService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Recipe[] | Observable<Recipe[]> | Promise<Recipe[]> {
    const existingRecipes: Recipe[] = this.recipeService.getRecipes();
    if (existingRecipes.length > 0) {
      console.log('No need to load recipes from a server.');
      return existingRecipes;
    } else {
      console.log('Loading recipes from a server...');
      return this.dataStorageService.fetchRecipes();
    }
  }

}
