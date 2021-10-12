import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ShoppingListService } from './service/shopping-list.service';
import * as fromShoppingList from './store/shopping-list.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {

  ingredientsObs: Observable<fromShoppingList.State>;

  constructor(private shoppingListService: ShoppingListService, private store: Store<fromShoppingList.AppState>) {}

  ngOnInit(): void {
    this.ingredientsObs = this.store.select('shoppingList');
  }

  ngOnDestroy(): void {
  }

  onEditIngredient(ingredientName: string): void {
    this.shoppingListService.startedEditing.next(ingredientName);
  }

}
