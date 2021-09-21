import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs/internal/Subscription';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './service/shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {

  ingredientsObs: Observable<{ ingredients: Ingredient[] }>;
  // ingredients: Ingredient[];
  // private ingredientChangedSubscription: Subscription;

  constructor(private shoppingListService: ShoppingListService, private store: Store<{ shoppingList: { ingredients: Ingredient[] } }>) {}

  ngOnInit(): void {
    this.ingredientsObs = this.store.select('shoppingList');
    // this.ingredients = this.shoppingListService.getIngredients();
    // this.ingredientChangedSubscription = this.shoppingListService.ingredientChanged.subscribe(
      // (ingredientChanged: Ingredient[]) => {
        // this.ingredients = ingredientChanged;
      // }
    // )
  }

  ngOnDestroy(): void {
    // this.ingredientChangedSubscription.unsubscribe();
  }

  onEditIngredient(indx: number): void {
    this.shoppingListService.startedEditing.next(indx);
  }

}
