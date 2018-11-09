function getRankingWithOrdinalIndicator(ranking: number): string {
  if (ranking % 100 > 10 && ranking % 100 < 20) {
    return `${ranking}th`;
  }
  switch (ranking % 10) {
    case 1:
      return `${ranking}st`;
    case 2:
      return `${ranking}nd`;
    case 3:
      return `${ranking}rd`;
    default:
      return `${ranking}th`;
  }
}

export default getRankingWithOrdinalIndicator;
