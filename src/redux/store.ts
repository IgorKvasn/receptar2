import { configureStore } from '@reduxjs/toolkit';
import recipesReducer from './slices/recipesSlice';
import recipeDetailReducer from './slices/recipeDetailSlice';
import userReducer from './slices/userSlice';

import thunk from 'redux-thunk';

export const store = configureStore({
  reducer: {
    recipes: recipesReducer,
    recipeDetail: recipeDetailReducer,
    loggedUser: userReducer
  },
  middleware: [thunk]
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

/*

https://redux.js.org/usage/usage-with-typescript
    https://immerjs.github.io/immer/example-setstate
*/
