export default class AddResults {
  constructor(
    containerSelector,
    jsonUrl,
    result,
    rankElement,
    textRankElement
  ) {
    this.summaryContainer = document.querySelector(containerSelector);
    this.jsonUrl = jsonUrl;
    this.result = result;
    this.rankElement = rankElement;
    this.textRankElement = textRankElement;
  }

  // Busca pela url informada
  async fetchData() {
    const response = await fetch(this.jsonUrl);
    if (!response.ok) throw new Error("Erro ao carregar o JSON");
    return await response.json();
  }

  // Cria o molde do elemento HTML
  createItemTemplate(item) {
    const li = document.createElement("li");
    // Adiciona a classe base e a classe específica (ex: reaction)
    li.classList.add("summary__item", item.category.toLowerCase());

    // Define o conteúdo interno
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

  // Calcula o score atingido
  calculateAverage(data) {
    const totalSum = data.reduce((acc, item) => acc + item.score, 0);
    return data.length > 0 ? Math.floor(totalSum / data.length) : 0;
  }

  // Adiciona o texto do score atingido
  updateResultDOM(score) {
    const resultElement = document.querySelector(this.result);
    if (!resultElement) {
      console.warn("Não foi encontrado o elemento para adicionar o resultado");
      return;
    } else {
      resultElement.textContent = score;
    }
  }

  // Atualiza as frases de acordo com o score
  updateFeedbackDOM(score) {
    const rankElement = document.querySelector(this.rankElement);
    const textRankElement = document.querySelector(this.textRankElement);

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

  // Monta e renderiza na tela
  async render() {
    try {
      const data = await this.fetchData();
      // Calcula a média da pontuação
      const average = this.calculateAverage(data);
      // Atualiza o score no elemento de resultado
      this.updateResultDOM(average);
      this.updateFeedbackDOM(average);

      // Renderiza a lista do sumário
      this.summaryContainer.innerHTML = "";
      data.forEach((item) => {
        const itemElement = this.createItemTemplate(item);
        this.summaryContainer.appendChild(itemElement);
      });
    } catch (error) {
      console.error("Falha na renderização:", error);
      if (this.summaryContainer) {
        this.summaryContainer.innerHTML = "<p>Erro ao carregar dados</p>";
      }
    }
  }

  init() {
    if (this.summaryContainer) {
      this.render();
    } else {
      console.warn(`Container não encontrado.`);
    }
    return this;
  }
}
