export default class ThemeManager {
  constructor() {
    // Properties
    this.bodyElement = document.querySelector("body");
    this.isDarkModeMediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );
    this.themeBtn = document.querySelector("#btn-theme");
    this.lightImg = document.querySelector("#img-theme-light");
    this.darkImg = document.querySelector("#img-theme-dark");
  }

  // Method to visually apply the Dark theme
  setDark() {
    this.bodyElement.dataset.darkTheme = "";
    this.darkImg.dataset.themeActive = "Active";
    delete this.lightImg.dataset.themeActive;
  }

  // Method to visually apply the Light theme
  setLight() {
    delete this.bodyElement.dataset.darkTheme;
    this.lightImg.dataset.themeActive = "Active";
    delete this.darkImg.dataset.themeActive;
  }

  // Verifies and applies the correct theme on load
  checkTheme() {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
      savedTheme === "dark" ? this.setDark() : this.setLight();
    } else {
      this.isDarkModeMediaQuery.matches ? this.setDark() : this.setLight();
    }
  }

  // Manually toggles the theme and saves the preference
  toggleTheme() {
    if (this.bodyElement.dataset.darkTheme !== undefined) {
      this.setLight();
      localStorage.setItem("theme", "light");
    } else {
      this.setDark();
      localStorage.setItem("theme", "dark");
    }
  }

  // Sets up event listeners
  init() {
    // Apply the correct theme immediately upon loading
    this.checkTheme();

    // Listen for system changes (only acts if there is no manual choice)
    this.isDarkModeMediaQuery.addEventListener("change", () => {
      if (!localStorage.getItem("theme")) {
        this.checkTheme();
      }
    });

    // Listen for button clicks
    if (this.themeBtn) {
      this.themeBtn.addEventListener("click", () => this.toggleTheme());
    }
  }
}
