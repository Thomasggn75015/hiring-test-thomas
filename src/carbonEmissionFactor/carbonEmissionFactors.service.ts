import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { CarbonEmissionFactor } from "./carbonEmissionFactor.entity";
import { CreateCarbonEmissionFactorDto } from "./dto/create-carbonEmissionFactor.dto";

@Injectable()
export class CarbonEmissionFactorsService {
  constructor(
    @InjectRepository(CarbonEmissionFactor)
    private carbonEmissionFactorRepository: Repository<CarbonEmissionFactor>
  ) {}

  async findAll(): Promise<CarbonEmissionFactor[]> {
    return await this.carbonEmissionFactorRepository.find();
  }

  async findByNames(names: string[]): Promise<CarbonEmissionFactor[] | null> {
    if (names.length === 0) return null;
    return await this.carbonEmissionFactorRepository.find({
      where: {
        name: In(names),
      },
    });
  }

  async save(
    carbonEmissionFactor: CreateCarbonEmissionFactorDto[]
  ): Promise<CarbonEmissionFactor[] | null> {
    return await this.carbonEmissionFactorRepository.save(carbonEmissionFactor);
  }
}
