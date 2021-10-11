import { Ingredient } from './ingredient';

export class Recipe {
  id: number;
  name: string;
  rating: 0 | 1 | 2 | 3 | 4 | 5;
  description: string;
  ingredients: Ingredient[];
  createDate: Date;
}
