import { GreenlyDataSource, dataSource } from "../../config/dataSource";
import { getTestEmissionFactor } from "../seed-dev-data";
import { CarbonEmissionFactor } from "./carbonEmissionFactor.entity";
import { CarbonEmissionFactorsService } from "./carbonEmissionFactors.service";

let flourEmissionFactor = getTestEmissionFactor("flour");
let hamEmissionFactor = getTestEmissionFactor("ham");
let olivedOilEmissionFactor = getTestEmissionFactor("oliveOil");
let carbonEmissionFactorService: CarbonEmissionFactorsService;

beforeAll(async () => {
  await dataSource.initialize();
  carbonEmissionFactorService = new CarbonEmissionFactorsService(
    dataSource.getRepository(CarbonEmissionFactor)
  );
});

beforeEach(async () => {
  await GreenlyDataSource.cleanDatabase();
  await dataSource
    .getRepository(CarbonEmissionFactor)
    .save(olivedOilEmissionFactor);
});

describe("CarbonEmissionFactors.service", () => {
  it("should save new emissionFactors", async () => {
    await carbonEmissionFactorService.save([
      hamEmissionFactor,
      flourEmissionFactor,
    ]);
    const retrieveChickenEmissionFactor = await dataSource
      .getRepository(CarbonEmissionFactor)
      .findOne({ where: { name: "flour" } });
    expect(retrieveChickenEmissionFactor?.name).toBe("flour");
  });

  it("should retrieve emission Factors", async () => {
    const carbonEmissionFactors = await carbonEmissionFactorService.findAll();
    expect(carbonEmissionFactors).toHaveLength(1);
  });

  it("should batch retrieve emission factors by name", async () => {
    const names = ["ham", "cheese", "tomato", "flour", "oliveOil"];
    const mockData = [
      getTestEmissionFactor("ham"),
      getTestEmissionFactor("cheese"),
      getTestEmissionFactor("tomato"),
      getTestEmissionFactor("flour"),
      getTestEmissionFactor("oliveOil"),
    ];
    jest
      .spyOn(carbonEmissionFactorService, "findByNames")
      .mockResolvedValue(mockData);

    const result = await carbonEmissionFactorService.findByNames(names);
    expect(result).toEqual(mockData);
  });

  it("should return empty array when no emission factors are found (findByNames)", async () => {
    const names = ["mockName1", "mockName2"];
    jest
      .spyOn(carbonEmissionFactorService, "findByNames")
      .mockResolvedValue([]);

    const result = await carbonEmissionFactorService.findByNames(names);
    expect(result).toEqual([]);
  });

  it(" should return empty array when input empty array (findByNames)", async () => {
    const names: string[] = [];
    jest
      .spyOn(carbonEmissionFactorService, "findByNames")
      .mockResolvedValue([]);

    const result = await carbonEmissionFactorService.findByNames(names);
    expect(result).toEqual([]);
  });
});

afterAll(async () => {
  await dataSource.destroy();
});
