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
  edittingIngredientIndex: number;
  edittingIngredient: Ingredient;

  constructor(private shoppingListService: ShoppingListService) {}

  ngOnInit(): void {
    this.subscription = this.shoppingListService.startedEditing.subscribe(
      (index: number) => {
        this.edittingMode = true;
        this.edittingIngredientIndex = index;
        this.edittingIngredient = this.shoppingListService.getIngredient(index);
        this.ingredientForm.setValue({
          ingredientName: this.edittingIngredient.name,
          ingredientAmount: this.edittingIngredient.amount
        });
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
  }

  onDeleteIngredient(): void {
    this.shoppingListService.deleteIngredient(this.edittingIngredientIndex);
    this.onClearForm();
  }

}
