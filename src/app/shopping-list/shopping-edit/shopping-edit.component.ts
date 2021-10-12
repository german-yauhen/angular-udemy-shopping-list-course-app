import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../service/shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  @ViewChild('ingredientForm')
  ingredientForm: NgForm;

  edittingMode: boolean = false;

  subscription: Subscription;
  edittingIngredientName: string;
  edittingIngredient: Ingredient;

  constructor(private shoppingListService: ShoppingListService) {}

  ngOnInit(): void {
    this.subscription = this.shoppingListService.getShoppingListSate().subscribe(stateData => {
      if (stateData.editingIngredientName) {
        this.edittingMode = true;
        this.edittingIngredientName = stateData.editingIngredientName;
        this.edittingIngredient = this.shoppingListService.findIngredient(this.edittingIngredientName);
        this.ingredientForm.setValue({
          ingredientName: this.edittingIngredient.name,
          ingredientAmount: this.edittingIngredient.amount
        });
      } else {
        this.edittingMode = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.shoppingListService.stopEditingIngredient();
  }

  onAddOrUpdateIngredient(ingredientForm: NgForm): void {
    const ingredient: Ingredient = new Ingredient(
      ingredientForm.value.ingredientName,
      Number.parseInt(ingredientForm.value.ingredientAmount)
    );
    this.shoppingListService.addOrUpdateIngredient(ingredient);
    this.onClearForm();
  }

  onClearForm(): void {
    this.edittingMode = false;
    this.ingredientForm.reset();
    this.shoppingListService.stopEditingIngredient();
  }

  onDeleteIngredient(): void {
    this.shoppingListService.deleteIngredient(this.edittingIngredientName);
    this.onClearForm();
  }

}
