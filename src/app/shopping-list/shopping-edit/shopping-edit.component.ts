import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../service/shopping-list.service';
import * as ShoppingListActions from '../store/shopping-list-actions';

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

  constructor(private shoppingListService: ShoppingListService,
    private store: Store<{ shoppingList: { ingredients: Ingredient[] } }>) {}

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

  onAddIngredient(ingredientForm: NgForm): void {
    const newIngredient: Ingredient = new Ingredient(
      ingredientForm.value.ingredientName,
      Number.parseInt(ingredientForm.value.ingredientAmount)
    );
    this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient))
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
