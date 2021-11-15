import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { Recipe, RecipeRating } from '../../../objects/recipe';

// Define a type for the slice state
interface RecipeDetailState {
  recipe: Recipe;
}

// Define the initial state using that type
const initialState: RecipeDetailState = {
  recipe: null
};

export const recipesSlice = createSlice({
  name: 'recipeDetail',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setRecipe: (state, action: PayloadAction<Recipe>) => {
      state.recipe = action.payload;
    },
    setRecipeRating: (state, action: PayloadAction<RecipeRating>) => {
      state.recipe.rating = action.payload;
    },
    setRecipeHeader: (state, action: PayloadAction<string>) => {
      state.recipe.name = action.payload;
    },
    setRecipeDescription: (state, action: PayloadAction<string>) => {
      state.recipe.description = action.payload;
    },
    toggleIngredient: (state, action: PayloadAction<number>) => {
      state.recipe.ingredients[action.payload].selected =
        !state.recipe.ingredients[action.payload].selected;
    },
    clearIngredients: (state) => {
      state.recipe.ingredients.forEach((ingr) => (ingr.selected = false));
    }
  }
});

export const {
  setRecipe,
  setRecipeRating,
  setRecipeHeader,
  setRecipeDescription,
  toggleIngredient,
  clearIngredients
} = recipesSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value;

export default recipesSlice.reducer;
