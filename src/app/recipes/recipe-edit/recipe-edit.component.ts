import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
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
    console.log(this.recipeForm);
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
          recipeIngredients.push(
            new FormGroup({
              'ingredientName': new FormControl(ingredient.name),
              'ingredientAmount': new FormControl(ingredient.amount)
            })
          );
        }
      }
    }

    this.recipeForm = new FormGroup({
      'recipeName': new FormControl(recipeName),
      // 'recipeAmount': new FormControl(),
      'recipeImage': new FormControl(recipeImagePath),
      'recipeDescription': new FormControl(recipeDescription),
      'recipeIngredients': recipeIngredients
    });
  }

  getIngredientsControls() {
    return (this.recipeForm.get('recipeIngredients') as FormArray).controls;
  }

}
