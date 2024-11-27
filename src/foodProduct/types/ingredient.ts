export type Ingredient = {
  name: string;
  quantity: number;
  unit: string;
};

export type IngredientRequest = {
  name: string;
  ingredients: Ingredient[];
};
