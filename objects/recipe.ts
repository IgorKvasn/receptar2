import { Ingredient } from './ingredient';

export type RecipeRating = 0 | 1 | 2 | 3 | 4 | 5;

export class Recipe {
  id: string;
  name: string;
  rating: RecipeRating;
  description: string;
  ingredients: Ingredient[] = [];
  createDate: Date;
}
