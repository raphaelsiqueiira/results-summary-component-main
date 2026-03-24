export default class AddResults {
  constructor(
    containerSelector,
    jsonUrl,
    resultSelector,
    rankSelector,
    textRankSelector
  ) {
    this.summaryContainer = document.querySelector(containerSelector);
    this.jsonUrl = jsonUrl;
    this.resultSelector = resultSelector;
    this.rankSelector = rankSelector;
    this.textRankSelector = textRankSelector;
  }

  // Fetch data from the provided URL
  async fetchData() {
    const response = await fetch(this.jsonUrl);
    if (!response.ok) throw new Error("Error loading JSON file");
    return await response.json();
  }

  // Create the HTML template for each summary item
  createItemTemplate(item) {
    const li = document.createElement("li");
    // Add base class and category-specific class (e.g., reaction, memory)
    li.classList.add("summary__item", item.category.toLowerCase());

    // Define internal content
    li.innerHTML = `
          <div>
            <img class="summary__icon" src="${item.icon}" alt="" aria-hidden="true">
            <h3 class="summary__item-title">${item.category}</h3>
          </div>
          <span class="summary_score-item">
            <strong class="score-deco">${item.score}</strong> / 100
          </span>
        `;

    return li;
  }

  // Calculate the average score
  calculateAverage(data) {
    const totalSum = data.reduce((acc, item) => acc + item.score, 0);
    return data.length > 0 ? Math.floor(totalSum / data.length) : 0;
  }

  // Update the numeric score in the DOM
  updateResultDOM(score) {
    const resultElement = document.querySelector(this.resultSelector);
    if (!resultElement) {
      console.warn("Result element not found to display the score.");
      return;
    }
    this.animateValue(resultElement, score, 600);
  }

  // Animates a numeric value from 0 to the target
  animateValue(element, target, duration = 1000) {
    let startTimestamp = null;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;

      // Calculate progress (0 to 1)
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);

      // Update element text with the current eased value
      element.textContent = Math.floor(progress * target);

      // Continue animation if progress is not finished
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }

  // Update feedback phrases based on the score achieved
  updateFeedbackDOM(score) {
    const rankElement = document.querySelector(this.rankSelector);
    const textRankElement = document.querySelector(this.textRankSelector);

    if (!rankElement || !textRankElement) return;

    if (score > 90) {
      rankElement.textContent = "Excellent";
      textRankElement.textContent = "You scored higher than 95% of the people!";
    } else if (score > 70) {
      rankElement.textContent = "Great";
      textRankElement.textContent =
        "You scored higher than 65% of the people who have taken these tests.";
    } else {
      rankElement.textContent = "Good";
      textRankElement.textContent = "Keep practicing to improve your score!";
    }
  }

  // Assemble and render components to the screen
  async render() {
    try {
      const data = await this.fetchData();

      // Calculate and update the top section (Result)
      const average = this.calculateAverage(data);
      this.updateResultDOM(average);
      this.updateFeedbackDOM(average);

      // Render the summary list
      if (this.summaryContainer) {
        this.summaryContainer.innerHTML = "";
        data.forEach((item) => {
          const itemElement = this.createItemTemplate(item);
          this.summaryContainer.appendChild(itemElement);

          const scoreElement = itemElement.querySelector(".score-deco");
          this.animateValue(scoreElement, item.score, 600);
        });
      }
    } catch (error) {
      console.error("Rendering failed:", error);
      if (this.summaryContainer) {
        this.summaryContainer.innerHTML =
          "<p>Error loading data. Please try again later.</p>";
      }
    }
  }

  // Initialize the class
  init() {
    if (this.summaryContainer) {
      this.render();
    } else {
      console.warn("Summary container not found.");
    }
    return this;
  }
}
