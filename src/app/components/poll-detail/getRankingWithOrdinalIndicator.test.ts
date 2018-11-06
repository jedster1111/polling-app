import getRankingWithOrdinalIndicator from "./getRankingWithOrdinalIndicator";

it("should return st to numbers ending in 1", () => {
  expect(getRankingWithOrdinalIndicator(1)).toBe("1st");
  expect(getRankingWithOrdinalIndicator(21)).toBe("21st");
});

it("should return nd for numbers ending in 2", () => {
  expect(getRankingWithOrdinalIndicator(2)).toBe("2nd");
  expect(getRankingWithOrdinalIndicator(22)).toBe("22nd");
});

it("should return rd for numbers ending in 3", () => {
  expect(getRankingWithOrdinalIndicator(3)).toBe("3rd");
  expect(getRankingWithOrdinalIndicator(33)).toBe("33rd");
});
it("should return th for any other numbers", () => {
  expect(getRankingWithOrdinalIndicator(4)).toBe("4th");
  expect(getRankingWithOrdinalIndicator(44)).toBe("44th");
  expect(getRankingWithOrdinalIndicator(10)).toBe("10th");
  expect(getRankingWithOrdinalIndicator(100)).toBe("100th");
});

it("should return th for all numbers between 10 and 20", () => {
  for (let i = 11; i < 20; i++) {
    expect(getRankingWithOrdinalIndicator(11)).toBe("11th");
  }
  expect(getRankingWithOrdinalIndicator(113)).toBe("113th");
});
