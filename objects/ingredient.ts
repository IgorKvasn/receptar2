export class Ingredient {
  name: string;
  amount: number;
  unit: 'g' | 'ml' | 'pcs';
  selected?: boolean = false;
}
