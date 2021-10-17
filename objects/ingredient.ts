export class Ingredient {
  name: string;
  amount: number;
  unit: 'g' | 'ml' | 'pcs' | 'tblsp' | 'teasp' | 'handful';
  selected?: boolean = false;
}
