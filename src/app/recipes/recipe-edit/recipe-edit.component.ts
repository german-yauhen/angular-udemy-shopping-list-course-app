import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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

  private initForm(): void {
    let recipeName: string = '';
    let recipeImagePath: string = '';
    let recipeDescription: string = '';

    if (this.editMode) {
      const recipe: Recipe = this.recipeService.getRecipe(this.recipeId);
      recipeName = recipe.name;
      recipeImagePath = recipe.imagePath;
      recipeDescription = recipe.description;
    }

    this.recipeForm = new FormGroup({
      'recipeName': new FormControl(recipeName),
      // 'recipeAmount': new FormControl(),
      'recipeImage': new FormControl(recipeImagePath),
      'recipeDescription': new FormControl(recipeDescription)
    });
  }

}
