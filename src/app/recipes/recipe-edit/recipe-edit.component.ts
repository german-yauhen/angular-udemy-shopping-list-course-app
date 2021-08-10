import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../service/recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {

  recipeId: number;
  editMode: boolean = false;

  recipeForm: FormGroup;

  constructor(private activatedRoute: ActivatedRoute, private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.editMode = params['id'] != null;
        if (this.editMode) {
          this.recipeId = +params['id'];
        }
        this.initForm();
      }
    );
  }

  onSubimt(): void {
    const recipe: Recipe = this.extractRecipeFromForm();
    if (this.editMode) {
      this.recipeService.updateRecipe(recipe);
    } else {
      this.recipeService.addRecipe(recipe);
    }
  }

  getIngredientsControls() {
    return (this.recipeForm.get('recipeIngredients') as FormArray).controls;
  }

  onAddIngredient(): void {
    this.getIngredientsControls().push(
      this.formGroupForIngredient(null)
    );
  }

  private extractRecipeFromForm(): Recipe {
    return new Recipe(
      this.editMode ? this.recipeId : this.recipeService.generateId(),
      this.recipeForm.value['recipeName'],
      this.recipeForm.value['recipeDescription'],
      this.recipeForm.value['recipeImage'],
      this.extractIngredientsFromForm()
    );
  }

  private extractIngredientsFromForm(): Ingredient[] {
    const ingredients: Ingredient[] = [];
    for (const ingredientControl of this.getIngredientsControls()) {
      ingredients.push(
        new Ingredient(
          ingredientControl.value.ingredientName,
          Number.parseInt(ingredientControl.value.ingredientAmount)
        )
      );
    }
    return ingredients;
  }

  private initForm(): void {
    let recipeName: string = '';
    let recipeImagePath: string = '';
    let recipeDescription: string = '';

    let recipeIngredients: FormArray = new FormArray([]);

    if (this.editMode) {
      const recipe: Recipe = this.recipeService.getRecipe(this.recipeId);
      recipeName = recipe.name;
      recipeImagePath = recipe.imagePath;
      recipeDescription = recipe.description;

      if (recipe['ingredients']) {
        for (const ingredient of recipe.ingredients) {
          recipeIngredients.push(this.formGroupForIngredient(ingredient));
        }
      }
    }

    this.recipeForm = new FormGroup({
      'recipeName': new FormControl(recipeName, Validators.required),
      'recipeImage': new FormControl(recipeImagePath, Validators.required),
      'recipeDescription': new FormControl(recipeDescription, Validators.required),
      'recipeIngredients': recipeIngredients
    });
  }

  private formGroupForIngredient(ingredient: Ingredient): FormGroup {
    return new FormGroup({
      'ingredientName': new FormControl(ingredient ? ingredient.name : null, Validators.required),
      'ingredientAmount': new FormControl(ingredient ? ingredient.amount : null, [Validators.required, Validators.pattern('[1-9]+[0-9]*$')])
    })
  }

}
