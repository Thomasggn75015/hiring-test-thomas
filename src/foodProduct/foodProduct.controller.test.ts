import { BadRequestException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { CarbonEmissionFactorsService } from "../carbonEmissionFactor/carbonEmissionFactors.service";
import { getTestEmissionFactor, getTestFoodProduct } from "../seed-dev-data";
import { FoodProductController } from "./foodProduct.controller";
import { FoodProductService } from "./foodProduct.service";

describe("FoodProductController", () => {
  let controller: FoodProductController;
  let foodProductService: FoodProductService;
  let mockEmissionFactors = [
    getTestEmissionFactor("ham"),
    getTestEmissionFactor("tomato"),
    getTestEmissionFactor("cheese"),
    getTestEmissionFactor("flour"),
    getTestEmissionFactor("blueCheese"),
    getTestEmissionFactor("vinegar"),
    getTestEmissionFactor("beef"),
    getTestEmissionFactor("oliveOil"),
  ];
  let mockFoodProduct = getTestFoodProduct("hamCheesePizza");
  let mockFoodProducts = [
    getTestFoodProduct("hamCheesePizza"),
    getTestFoodProduct("carbonaraTagliatelle"),
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FoodProductController],
      providers: [
        {
          provide: FoodProductService,
          useValue: {
            findAll: jest.fn(),
            findById: jest.fn(),
            findByName: jest.fn(),
            createFoodProduct: jest.fn(),
          },
        },
        {
          provide: CarbonEmissionFactorsService,
          useValue: {},
        },
      ],
    }).compile();
    controller = module.get<FoodProductController>(FoodProductController);
    foodProductService = module.get<FoodProductService>(FoodProductService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should get all food products", async () => {
    jest
      .spyOn(foodProductService, "findAll")
      .mockResolvedValue(mockFoodProducts);

    const result = await controller.getFoodProducts();
    expect(result).toEqual(mockFoodProducts);
    expect(foodProductService.findAll).toHaveBeenCalledTimes(1);
  });

  it("should get food product by id", async () => {
    jest
      .spyOn(foodProductService, "findById")
      .mockResolvedValue(mockFoodProduct);

    const result = await controller.GetById(1);
    expect(result).toEqual(mockFoodProduct);
  });

  it("should return null if id of food product was not found", async () => {
    jest.spyOn(foodProductService, "findById").mockResolvedValue(null);

    const result = await controller.GetById(999);
    expect(result).toBeNull();
    expect(foodProductService.findById).toHaveBeenCalledWith(999);
  });

  it("should get food product by name", async () => {
    jest
      .spyOn(foodProductService, "findByName")
      .mockResolvedValue(mockFoodProduct);

    const result = await controller.GetByName("Pizza");
    expect(result).toEqual(mockFoodProduct);
    expect(foodProductService.findByName).toHaveBeenCalledWith("Pizza");
  });

  it("should return null if name of food product was not found", async () => {
    jest.spyOn(foodProductService, "findByName").mockResolvedValue(null);

    const result = await controller.GetByName("mockError");
    expect(result).toBeNull();
    expect(foodProductService.findByName).toHaveBeenCalledWith("mockError");
  });

  it("should create and return a food product", async () => {
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
      ],
    };
    jest
      .spyOn(foodProductService, "createFoodProduct")
      .mockResolvedValue([mockFoodProduct]);

    const result = await controller.createFoodProduct(ingredientRequest);
    expect(result).toEqual([mockFoodProduct]);
  });
  it("should throw a BadRequestException if something went wrong", async () => {
    const ingredientRequest = {
      name: "hamCheesePizza",
      ingredients: [],
    };
    jest
      .spyOn(foodProductService, "createFoodProduct")
      .mockRejectedValue(
        new BadRequestException("Error creating new food product")
      );
    try {
      await controller.createFoodProduct(ingredientRequest);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toBe("Error creating new food product");
    }
  });
});
