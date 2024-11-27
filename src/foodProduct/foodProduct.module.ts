import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CarbonEmissionFactorsModule } from "../carbonEmissionFactor/carbonEmissionFactors.module";
import { FoodProductController } from "./foodProduct.controller";
import { FoodProduct } from "./foodProduct.entity";
import { FoodProductService } from "./foodProduct.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([FoodProduct]),
    CarbonEmissionFactorsModule,
  ],
  controllers: [FoodProductController],
  providers: [FoodProductService],
})
export class FoodProductModule {}
