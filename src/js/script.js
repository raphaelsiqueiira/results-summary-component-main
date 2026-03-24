import AddResults from "./results.js";
import ThemeManager from "./theme-manager.js";

const summaryList = new AddResults(
  "#summary-item-container",
  "../data.json",
  "#results-score-achieved",
  "#results-rank",
  "#results-text"
);

const themeManager = new ThemeManager();

summaryList.init();
themeManager.init();
