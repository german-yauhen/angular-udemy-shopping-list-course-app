import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../service/shopping-list.service';

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

  constructor(private shoppingListService: ShoppingListService) {}

  ngOnInit(): void {
  }

  onAddIngredient(): void {
    const newIngredient: Ingredient = new Ingredient(
      this.ingredientNameInput.nativeElement.value,
      Number.parseInt(this.ingredientAmountInput.nativeElement.value)
    );
    this.shoppingListService.addNewIngredient(newIngredient);
  }

}
