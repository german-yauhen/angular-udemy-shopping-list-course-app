import { Ingredient } from "src/app/shared/ingredient.model";
import * as ShoppingListActions from "./shopping-list-actions";

export interface State {
  ingredients: Ingredient[];
  editingIngredient: Ingredient,
  editingIngredientName: string
}

export interface AppState {
  shoppingList: State;
}

const initialState = {
  ingredients: [
    new Ingredient('Apple', 3),
    new Ingredient('Pineapple', 2),
    new Ingredient('Diamond milk', 500)
  ],
  editingIngredient: null,
  editingIngredientName: null
};

export function shoppingListReducer(state = initialState, action: ShoppingListActions.ShoppingListActions) {
  switch (action.type) {
    case ShoppingListActions.ADD_INGREDIENT:
      return {
        ...state,
        ingredients: [...state.ingredients, action.payload]
      };

    case ShoppingListActions.ADD_INGREDIENTS:
      return {
        ...state,
        ingredients: [...state.ingredients, ...action.payload]
      };

    case ShoppingListActions.UPDATE_INGREDIENT:
      const ingredientName: string = action.payload.name.toUpperCase();

      let ingredientForUpdIndx: number;
      let ingredientForUpd: Ingredient;

      for (let index = 0; index < state.ingredients.length; index++) {
        const ingredient = state.ingredients[index];
        if (ingredientName === ingredient.name.toUpperCase()) {
          ingredientForUpdIndx = index;
          ingredientForUpd = ingredient;
          break;
        }
      }

      const ingredientUpddated: Ingredient = {
        ...ingredientForUpd,
        ...action.payload
      };

      const updatedIngredients: Ingredient[] = [...state.ingredients];
      updatedIngredients[ingredientForUpdIndx] = ingredientUpddated;

      return {
        ...state,
        ingredients: updatedIngredients
      };

    case ShoppingListActions.DELETE_INGREDIENT:
      return {
        ...state,
        ingredients: state.ingredients.filter(ingr => ingr.name !== action.payload.name)
      }

    case ShoppingListActions.START_EDIT_INGREDIENT:
      return {
        ...state,
        editingIngredientName: action.payload,
        editingIngredient: { ...findIngredient(action.payload, state.ingredients) }
      };

    case ShoppingListActions.STOP_EDIT_INGREDIENT:
      return {
        ...state,
        editingIngredientName: null,
        editingIngredient: null
      }
    default:
      return state;
  }
}

function findIngredient(name: string, ingredients: Ingredient[]): Ingredient {
  return ingredients.find(ingredient => ingredient.name.toUpperCase() === name);
}
