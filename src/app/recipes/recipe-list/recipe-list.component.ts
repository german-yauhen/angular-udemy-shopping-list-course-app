import { EventEmitter, Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {

  @Output()
  recipeWasSelected: EventEmitter<Recipe> = new EventEmitter<Recipe>();

  recipes: Recipe[] = [
    new Recipe('Pineapple cake', 'Summer garden fruits in a sweet glazed cream', 'https://images.freeimages.com/images/large-previews/b89/summer-garden-fruits-in-a-sweet-glazed-cream-pie-dessert-1632381.jpg'),
    new Recipe('Apple pie', 'Apple pie with almonds', 'https://images.freeimages.com/images/large-previews/815/apple-pie-with-almonds-1318484.jpg')
  ];

  constructor() { }

  ngOnInit(): void {
  }

  onRecipeSelected(recipeItem: Recipe): void {
    this.recipeWasSelected.emit(recipeItem);
  }

}
