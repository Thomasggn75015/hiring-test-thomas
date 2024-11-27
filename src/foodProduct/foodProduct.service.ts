import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CarbonEmissionFactor } from "../carbonEmissionFactor/carbonEmissionFactor.entity";
import { CarbonEmissionFactorsService } from "../carbonEmissionFactor/carbonEmissionFactors.service";
import { FoodProduct } from "./foodProduct.entity";
import { IngredientRequest } from "./types/ingredient";

@Injectable()
export class FoodProductService {
  constructor(
    @InjectRepository(FoodProduct)
    private foodProductRepository: Repository<FoodProduct>,
    private readonly carbonEmissionFactorService: CarbonEmissionFactorsService
  ) {}

  async findAll(): Promise<FoodProduct[]> {
    return await this.foodProductRepository.find();
  }

  async findById(id: number): Promise<FoodProduct | null> {
    return await this.foodProductRepository.findOneBy({ id });
  }

  async findByName(name: string): Promise<FoodProduct | null> {
    return await this.foodProductRepository.findOneBy({ name });
  }

  async save(foodProduct: FoodProduct | FoodProduct[]): Promise<FoodProduct[]> {
    const foodProducts: FoodProduct[] = Array.isArray(foodProduct)
      ? foodProduct
      : [foodProduct];
    const savedFoodProducts = [];
    for (let i = 0; i < foodProducts.length; i++) {
      const foodProduct = foodProducts[i];
      const savedFoodProduct =
        await this.foodProductRepository.save(foodProduct);
      savedFoodProducts.push(savedFoodProduct);
    }
    return savedFoodProducts;
  }

  async createFoodProduct(
    ingredientRequest: IngredientRequest
  ): Promise<FoodProduct[]> {
    const names = ingredientRequest.ingredients.map(
      (ingredient) => ingredient.name
    );
    let carbonEmissionFactors =
      await this.carbonEmissionFactorService.findByNames(names);
    if (!carbonEmissionFactors || carbonEmissionFactors.length === 0) {
      throw new NotFoundException("Could not find carbon emission factors");
    }
    const carbonFootprint = await this.calculateCarbonFootprint(
      carbonEmissionFactors,
      ingredientRequest
    );

    const foodProduct = new FoodProduct({
      name: ingredientRequest.name,
      ingredients: carbonEmissionFactors,
      carbonFootprint: carbonFootprint,
    });
    return await this.save(foodProduct);
  }

  async calculateCarbonFootprint(
    carbonEmissionFactors: CarbonEmissionFactor[],
    ingredientRequest: IngredientRequest
  ): Promise<number> {
    let carbonEmissionFactorsMap = new Map<string, number>(
      carbonEmissionFactors.map((carbonFactor) => [
        `${carbonFactor.name}-${carbonFactor.unit}`,
        carbonFactor.emissionCO2eInKgPerUnit,
      ])
    );

    const carbonFootprint = ingredientRequest.ingredients.reduce(
      (result, ingredient, index) => {
        const emissionFactor = carbonEmissionFactorsMap.get(
          `${ingredient.name}-${ingredient.unit}`
        );
        if (
          emissionFactor === undefined ||
          !ingredient?.quantity ||
          (index > 0 && result === 0)
        )
          return 0;
        return result + ingredient.quantity * emissionFactor;
      },
      0.0
    );
    return carbonFootprint;
  }
}
