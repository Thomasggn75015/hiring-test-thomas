import { NotFoundException } from "@nestjs/common";
import { dataSource, GreenlyDataSource } from "../../config/dataSource";
import { CarbonEmissionFactor } from "../carbonEmissionFactor/carbonEmissionFactor.entity";
import { CarbonEmissionFactorsService } from "../carbonEmissionFactor/carbonEmissionFactors.service";
import {
  getTestEmissionFactor,
  getTestFoodProduct,
  TEST_CARBON_EMISSION_FACTORS,
} from "../seed-dev-data";
import { FoodProduct } from "./foodProduct.entity";
import { FoodProductService } from "./foodProduct.service";

let hamCheesePizza = getTestFoodProduct("hamCheesePizza");
let foodProductService: FoodProductService;
let carbonEmissionFactorsService: CarbonEmissionFactorsService;
const ingredientRequest = {
  name: "hamCheesePizza",
  ingredients: [
    {
      name: "ham",
      quantity: 0.1,
      unit: "kg",
    },
    {
      name: "cheese",
      quantity: 0.12,
      unit: "kg",
    },
    {
      name: "tomato",
      quantity: 0.13,
      unit: "kg",
    },
    {
      name: "flour",
      quantity: 0.14,
      unit: "kg",
    },
    {
      name: "oliveOil",
      quantity: 0.3,
      unit: "kg",
    },
  ],
};

beforeAll(async () => {
  await dataSource.initialize();
  foodProductService = new FoodProductService(
    dataSource.getRepository(FoodProduct),
    (carbonEmissionFactorsService = new CarbonEmissionFactorsService(
      dataSource.getRepository(CarbonEmissionFactor)
    ))
  );
});

beforeEach(async () => {
  await GreenlyDataSource.cleanDatabase();
  await dataSource
    .getRepository(FoodProduct)
    .save(getTestFoodProduct("hamCheesePizza"));
});

describe("ProductFood.service", () => {
  it("should save new food products", async () => {
    await foodProductService.save(hamCheesePizza);
    const retrievehamCheesePizza = await dataSource
      .getRepository(FoodProduct)
      .findOne({ where: { name: "hamCheesePizza" } });
    expect(retrievehamCheesePizza?.name).toBe("hamCheesePizza");
  });

  it("should create new food products", async () => {
    const mockCarbonEmissionFactors = [
      getTestEmissionFactor("ham"),
      getTestEmissionFactor("cheese"),
      getTestEmissionFactor("tomato"),
      getTestEmissionFactor("flour"),
      getTestEmissionFactor("oliveOil"),
    ];

    jest
      .spyOn(carbonEmissionFactorsService, "findByNames")
      .mockResolvedValue(mockCarbonEmissionFactors);
    const foodProduct =
      await foodProductService.createFoodProduct(ingredientRequest);
    expect(foodProduct).not.toBeNull();
    expect(Array.isArray(foodProduct)).toBe(true);
    expect(foodProduct.length).toBeGreaterThan(0);
    expect(foodProduct?.[0].name).toBe("hamCheesePizza");
  });

  it("should retrieve food products", async () => {
    // await dataSource.getRepository(FoodProduct).save(hamCheesePizza);
    const foodProducts = await foodProductService.findAll();
    expect(foodProducts).not.toBeNull();
    expect(Array.isArray(foodProducts)).toBe(true);
    expect(foodProducts.length).toBeGreaterThan(0);
    expect(foodProducts?.[0].name).toBe("hamCheesePizza");
  });
  it("should retrieve food product by id", async () => {
    const foodProduct = await foodProductService.save([hamCheesePizza]);
    expect(foodProduct).not.toBeNull();
    expect(typeof foodProduct).toBe("object");
    expect(Array.isArray(foodProduct)).toBe(true);
    expect(foodProduct.length).toBeGreaterThan(0);
    const retrieveFoodProduct = await foodProductService.findById(
      foodProduct?.[0].id
    );
    if (foodProduct != null)
      expect(foodProduct?.[0].name).toBe("hamCheesePizza");
  });
  it("should retrieve food product by name", async () => {
    // await dataSource.getRepository(FoodProduct).save(hamCheesePizza);
    const foodProduct = await foodProductService.findByName("hamCheesePizza");
    expect(foodProduct).not.toBeNull();
    expect(typeof foodProduct).toBe("object");
    if (foodProduct != null) expect(foodProduct.name).toBe("hamCheesePizza");
  });
  it("should calculate agrybalise carbon footprint correctly", async () => {
    let carbonEmissionFactors = TEST_CARBON_EMISSION_FACTORS;
    const carbonFootprint = await foodProductService.calculateCarbonFootprint(
      carbonEmissionFactors,
      ingredientRequest
    );
    expect(carbonFootprint).toBeGreaterThan(0);
  });
  it("should return 0 when can't calculate agrybalise carbon footprint correctly", async () => {
    let carbonEmissionFactors = TEST_CARBON_EMISSION_FACTORS;
    let wrongUnitIngredientRequest = {
      name: "hamCheesePizza",
      ingredients: [
        {
          name: "ham",
          quantity: 0.11,
          unit: "g",
        },
        {
          name: "cheese",
          quantity: 0.12,
          unit: "kg",
        },
        {
          name: "tomato",
          quantity: 0.13,
          unit: "kg",
        },
        {
          name: "flour",
          quantity: 0.14,
          unit: "kg",
        },
        {
          name: "oliveOil",
          quantity: 0.3,
          unit: "kg",
        },
      ],
    };
    const carbonFootprint = await foodProductService.calculateCarbonFootprint(
      carbonEmissionFactors,
      wrongUnitIngredientRequest
    );
    expect(carbonFootprint).toBe(0);
  });

  it("should throw a NotFoundException if can't find carbon emission factors", async () => {
    const emptyIngredientRequest = {
      name: "hamCheesePizza",
      ingredients: [],
    };
    jest
      .spyOn(foodProductService, "createFoodProduct")
      .mockRejectedValue(
        new NotFoundException("Could not find carbon emission factors")
      );
    try {
      await foodProductService.createFoodProduct(emptyIngredientRequest);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe("Could not find carbon emission factors");
    }
  });
});

afterAll(async () => {
  await dataSource.destroy();
});
