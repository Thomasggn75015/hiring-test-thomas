import { MigrationInterface, QueryRunner } from "typeorm";

export class FoodProduct1732659605056 implements MigrationInterface {
    name = 'FoodProduct1732659605056'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "food_product" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "carbonFootprint" double precision NOT NULL, CONSTRAINT "PK_398d3643b03f14a730b364c7515" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "food_product_ingredients_carbon_emission_factors" ("foodProductId" integer NOT NULL, "carbonEmissionFactorsId" integer NOT NULL, CONSTRAINT "PK_38af0c57123e4e9d933532595f1" PRIMARY KEY ("foodProductId", "carbonEmissionFactorsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b9e1c19f77d6936bf81c8eb75c" ON "food_product_ingredients_carbon_emission_factors" ("foodProductId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ece8336a799ca65c5837ca60f1" ON "food_product_ingredients_carbon_emission_factors" ("carbonEmissionFactorsId") `);
        await queryRunner.query(`ALTER TABLE "food_product_ingredients_carbon_emission_factors" ADD CONSTRAINT "FK_b9e1c19f77d6936bf81c8eb75c8" FOREIGN KEY ("foodProductId") REFERENCES "food_product"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "food_product_ingredients_carbon_emission_factors" ADD CONSTRAINT "FK_ece8336a799ca65c5837ca60f1c" FOREIGN KEY ("carbonEmissionFactorsId") REFERENCES "carbon_emission_factors"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "food_product_ingredients_carbon_emission_factors" DROP CONSTRAINT "FK_ece8336a799ca65c5837ca60f1c"`);
        await queryRunner.query(`ALTER TABLE "food_product_ingredients_carbon_emission_factors" DROP CONSTRAINT "FK_b9e1c19f77d6936bf81c8eb75c8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ece8336a799ca65c5837ca60f1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b9e1c19f77d6936bf81c8eb75c"`);
        await queryRunner.query(`DROP TABLE "food_product_ingredients_carbon_emission_factors"`);
        await queryRunner.query(`DROP TABLE "food_product"`);
    }

}
