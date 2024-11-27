import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
} from "@nestjs/common";
import { CarbonEmissionFactorsService } from "../carbonEmissionFactor/carbonEmissionFactors.service";
import { FoodProduct } from "./foodProduct.entity";
import { FoodProductService } from "./foodProduct.service";
import { IngredientRequest } from "./types/ingredient";

@Controller("food-product")
export class FoodProductController {
  constructor(
    private readonly foodProductService: FoodProductService,
    private readonly carbonEmissionFactorService: CarbonEmissionFactorsService
  ) {}

  @Get()
  async getFoodProducts(): Promise<FoodProduct[]> {
    Logger.log(`[food-product] [GET] FoodProduct: getting all FoodProducts`);
    return await this.foodProductService.findAll();
  }

  @Get(":id")
  async GetById(@Param("id") id: number): Promise<FoodProduct | null> {
    Logger.log(
      `[food-product] [GET] FoodProduct: getting FoodProduct with id : ${id}`
    );
    return await this.foodProductService.findById(+id);
  }

  @Get(":name")
  async GetByName(@Param("name") name: string): Promise<FoodProduct | null> {
    Logger.log(
      `[food-product] [GET] FoodProduct: getting FoodProduct with name : ${name}`
    );
    return await this.foodProductService.findByName(name);
  }

  @Post()
  async createFoodProduct(
    @Body() ingredientRequest: IngredientRequest
  ): Promise<FoodProduct[]> {
    Logger.log(
      `[food-product] [POST] FoodProduct: calculating carbon foot print from ${ingredientRequest.name}`
    );
    try {
      return await this.foodProductService.createFoodProduct(ingredientRequest);
    } catch (e) {
      throw new BadRequestException("Error creating new food product");
    }
  }
}
