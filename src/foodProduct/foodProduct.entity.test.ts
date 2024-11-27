import { GreenlyDataSource, dataSource } from "../../config/dataSource";
import { TEST_CARBON_EMISSION_FACTORS } from "../seed-dev-data";
import { FoodProduct } from "./foodProduct.entity";

let pizzaFoodProduct: FoodProduct;
beforeAll(async () => {
  await dataSource.initialize();
  pizzaFoodProduct = new FoodProduct({
    name: "hamCheesePizza",
    ingredients: TEST_CARBON_EMISSION_FACTORS,
    carbonFootprint: 0.45,
  });
});
beforeEach(async () => {
  await GreenlyDataSource.cleanDatabase();
});
describe("FoodProductEntity", () => {
  describe("constructor", () => {
    it("should create a food product", () => {
      expect(pizzaFoodProduct.name).toBe("hamCheesePizza");
    });
  });
});

afterAll(async () => {
  await dataSource.destroy();
});
