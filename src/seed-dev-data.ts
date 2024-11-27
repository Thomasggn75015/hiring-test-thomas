import { dataSource } from "../config/dataSource";
import { CarbonEmissionFactor } from "./carbonEmissionFactor/carbonEmissionFactor.entity";
import { FoodProduct } from "./foodProduct/foodProduct.entity";

export const TEST_CARBON_EMISSION_FACTORS = [
  {
    name: "ham",
    unit: "kg",
    emissionCO2eInKgPerUnit: 0.11,
    source: "Agrybalise",
  },
  {
    name: "cheese",
    unit: "kg",
    emissionCO2eInKgPerUnit: 0.12,
    source: "Agrybalise",
  },
  {
    name: "tomato",
    unit: "kg",
    emissionCO2eInKgPerUnit: 0.13,
    source: "Agrybalise",
  },
  {
    name: "flour",
    unit: "kg",
    emissionCO2eInKgPerUnit: 0.14,
    source: "Agrybalise",
  },
  {
    name: "blueCheese",
    unit: "kg",
    emissionCO2eInKgPerUnit: 0.34,
    source: "Agrybalise",
  },
  {
    name: "vinegar",
    unit: "kg",
    emissionCO2eInKgPerUnit: 0.14,
    source: "Agrybalise",
  },
  {
    name: "beef",
    unit: "kg",
    emissionCO2eInKgPerUnit: 14,
    source: "Agrybalise",
  },
  {
    name: "oliveOil",
    unit: "kg",
    emissionCO2eInKgPerUnit: 0.15,
    source: "Agrybalise",
  },
].map((args) => {
  return new CarbonEmissionFactor({
    name: args.name,
    unit: args.unit,
    emissionCO2eInKgPerUnit: args.emissionCO2eInKgPerUnit,
    source: args.source,
  });
});

export const getTestEmissionFactor = (name: string) => {
  const emissionFactor = TEST_CARBON_EMISSION_FACTORS.find(
    (ef) => ef.name === name
  );
  if (!emissionFactor) {
    throw new Error(
      `test emission factor with name ${name} could not be found`
    );
  }
  return emissionFactor;
};

export const seedTestCarbonEmissionFactors = async () => {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }
  const carbonEmissionFactorsService =
    dataSource.getRepository(CarbonEmissionFactor);

  await carbonEmissionFactorsService.save(TEST_CARBON_EMISSION_FACTORS);
};

export const TEST_FOODPRODUCT = [
  {
    name: "carbonaraTagliatelle",
    ingredients: TEST_CARBON_EMISSION_FACTORS,
    carbonFootprint: 0.45,
  },
  {
    name: "hamCheesePizza",
    ingredients: TEST_CARBON_EMISSION_FACTORS,
    carbonFootprint: 0.685,
  },
  {
    name: "burrito",
    ingredients: TEST_CARBON_EMISSION_FACTORS,
    carbonFootprint: 0.8,
  },
].map((args) => {
  return new FoodProduct({
    name: args.name,
    ingredients: args.ingredients,
    carbonFootprint: args.carbonFootprint,
  });
});

export const getTestFoodProduct = (name: string) => {
  const foodProduct = TEST_FOODPRODUCT.find((ef) => ef.name === name);
  if (!foodProduct) {
    throw new Error(`test food product with name ${name} could not be found`);
  }
  return foodProduct;
};

export const seedTestFoodProducts = async () => {
  await seedTestCarbonEmissionFactors();
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }
  const carbonEmissionFactorsService =
    dataSource.getRepository(CarbonEmissionFactor);

  await carbonEmissionFactorsService.save(TEST_CARBON_EMISSION_FACTORS);
  const FoodProductsService = dataSource.getRepository(FoodProduct);

  await FoodProductsService.save(TEST_FOODPRODUCT);
};

if (require.main === module) {
  seedTestCarbonEmissionFactors().catch((e) => console.error(e));
  seedTestFoodProducts().catch((e) => console.error(e));
}
