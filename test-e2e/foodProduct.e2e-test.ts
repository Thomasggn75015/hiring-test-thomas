import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { dataSource } from "../config/dataSource";
import { AppModule } from "../src/app.module";
import { CarbonEmissionFactor } from "../src/carbonEmissionFactor/carbonEmissionFactor.entity";
import { FoodProduct } from "../src/foodProduct/foodProduct.entity";
import {
  getTestEmissionFactor,
  getTestFoodProduct,
} from "../src/seed-dev-data";

beforeAll(async () => {
  await dataSource.initialize();
});

afterAll(async () => {
  await dataSource.destroy();
});

describe("FoodProductController", () => {
  let app: INestApplication;
  let defaultFoodProduct: FoodProduct[];

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    await dataSource
      .getRepository(FoodProduct)
      .save([getTestFoodProduct("hamCheesePizza")]);

    await dataSource
      .getRepository(CarbonEmissionFactor)
      .save([
        getTestEmissionFactor("ham"),
        getTestEmissionFactor("cheese"),
        getTestEmissionFactor("tomato"),
        getTestEmissionFactor("oliveOil"),
        getTestEmissionFactor("flour"),
        getTestEmissionFactor("beef"),
      ]);

    defaultFoodProduct = await dataSource.getRepository(FoodProduct).find();
  });

  it("GET /food-product", async () => {
    await request(app.getHttpServer())
      .get("/food-product")
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual(defaultFoodProduct);
      });
  });

  it("POST /food-product", async () => {
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
    const response = await request(app.getHttpServer())
      .post("/food-product")
      .send(ingredientRequest)
      .expect(201);

    expect(response.body).toBeDefined();
    expect(Array.isArray(response.body) && response.body.length != 0).toBe(
      true
    );
    expect(response.body[0].carbonFootprint).toBeGreaterThan(0);
    expect(response.body[0].name).toBe("hamCheesePizza");
  });
});
