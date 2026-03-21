import AddResults from "./results.js";

const summaryList = new AddResults(
  "#summary-item-container",
  "../../../data.json",
  "#results-score-achieved",
  '#results-rank',
  "#results-text"
);

summaryList.init();
