import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './service/shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {

  ingredients: Ingredient[];
  private ingredientCHangedSubscription: Subscription;

  constructor(private shoppingListService: ShoppingListService) {}

  ngOnInit(): void {
    this.ingredients = this.shoppingListService.getIngredients();
    this.ingredientCHangedSubscription = this.shoppingListService.ingredientChanged.subscribe(
      (ingredientChanged: Ingredient[]) => {
        this.ingredients = ingredientChanged;
      }
    )
  }

  ngOnDestroy(): void {
    this.ingredientCHangedSubscription.unsubscribe();
  }

}
