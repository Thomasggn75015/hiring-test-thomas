import { CarbonEmissionFactor } from "../../carbonEmissionFactor/carbonEmissionFactor.entity";

export class CreateFoodProductDto {
  name: string;
  ingredients: CarbonEmissionFactor[];
  carbonFootprint: number;

  constructor(props: {
    name: string;
    ingredients: CarbonEmissionFactor[];
    carbonFootprint: number;
  }) {
    this.name = props.name;
    this.ingredients = props.ingredients;
    this.carbonFootprint = props.carbonFootprint;
  }
}
