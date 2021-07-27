import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit {

  @ViewChild('ingredientNameInput')
  ingredientNameInput: ElementRef;

  @ViewChild('ingredientAmountInput')
  ingredientAmountInput: ElementRef;

  @Output()
  createIngredientEvent: EventEmitter<Ingredient> = new EventEmitter<Ingredient>();

  constructor() { }

  ngOnInit(): void {
  }

  onAddIngredient(): void {
    const newIngredient: Ingredient = new Ingredient(
      this.ingredientNameInput.nativeElement.value,
      Number.parseInt(this.ingredientAmountInput.nativeElement.value)
    );
    this.createIngredientEvent.emit(newIngredient);
  }

}
