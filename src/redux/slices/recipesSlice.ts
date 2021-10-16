import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { Recipe } from '../../../objects/recipe';
import { SortInfo } from '../../pages';

// Define a type for the slice state
interface RecipesState {
  recipes: Recipe[];
}

// Define the initial state using that type
const initialState: RecipesState = {
  recipes: []
};

export const recipesSlice = createSlice({
  name: 'recipes',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addAllRecipes: (state, action: PayloadAction<Recipe[]>) => {
      state.recipes = action.payload;
    },
    reorderRecipes: (state, action: PayloadAction<SortInfo>) => {
      let sortInfo = action.payload;
      let sortFn;
      if (sortInfo.order === null) {
        sortFn = (r1, r2) => {
          return r1.id - r2.id;
        };
      } else {
        if (typeof state.recipes[0][sortInfo.column] === 'string') {
          sortFn = (r1, r2) => {
            let a = r1[sortInfo.column];
            let b = r2[sortInfo.column];
            let sort = a.localeCompare(b);
            console.log('a' + a + ' b' + b);
            if (sortInfo.order === 'DESC') {
              return sort;
            }
            if (sortInfo.order === 'ASC') {
              return sort * -1;
            }
            console.log('unknown sort order', sortInfo.order);
          };
        }
        if (
          typeof state.recipes[0][sortInfo.column] === 'number' ||
          state.recipes[0][sortInfo.column] instanceof Date
        ) {
          sortFn = (r1, r2) => {
            let a = Number(r1[sortInfo.column]);
            let b = Number(r2[sortInfo.column]);
            let sort = b - a;
            console.log('a' + a + ' b' + b);
            if (sortInfo.order === 'DESC') {
              return sort * -1;
            }
            if (sortInfo.order === 'ASC') {
              return sort;
            }
          };
        }
      }
      state.recipes.sort(sortFn);
    }
  }
});

export const { addAllRecipes, reorderRecipes } = recipesSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value;

export default recipesSlice.reducer;
