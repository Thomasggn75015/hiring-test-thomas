import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CarbonEmissionFactor } from "../carbonEmissionFactor/carbonEmissionFactor.entity";

@Entity()
export class FoodProduct extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  name: string;

  @ManyToMany((type) => CarbonEmissionFactor, { eager: true })
  @JoinTable()
  ingredients: CarbonEmissionFactor[];

  @Column({
    type: "float",
    nullable: false,
  })
  carbonFootprint: number;

  constructor(props: {
    name: string;
    ingredients: CarbonEmissionFactor[];
    carbonFootprint: number;
  }) {
    super();
    this.name = props?.name;
    this.ingredients = props?.ingredients;
    this.carbonFootprint = props?.carbonFootprint;
  }
}
