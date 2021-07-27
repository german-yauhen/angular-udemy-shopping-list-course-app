import { EventEmitter, Output } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { Recipe } from '../../recipe.model';

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.css']
})
export class RecipeItemComponent implements OnInit {

  @Output()
  recipeSelected: EventEmitter<void> = new EventEmitter<void>();

  @Input()
  recipe: Recipe;

  constructor() { }

  ngOnInit(): void {
  }

  onRecipeSelected(): void {
    this.recipeSelected.emit();
  }

}
