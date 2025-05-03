// components/class-filter-buttons.js
import { CLASS_COLORS, CLASS_ICONS } from "../modules/utils/characterMedia.js";

class ClassFilterButtons extends HTMLElement {
  constructor() {
    super();
    this.selectedClass = null;
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }

  setupEventListeners() {
    this.addEventListener("click", this.handleClick);
  }

  removeEventListeners() {
    this.removeEventListener("click", this.handleClick);
  }

  handleClick = (event) => {
    const button = event.target.closest(".class-filter-btn");
    if (!button) return;

    const classType = button.dataset.class;

    // Toggle selection: if clicking the same class, deselect it
    if (this.selectedClass === classType) {
      this.selectedClass = null;
      this.updateButtonStyles();

      // Dispatch event for deselection
      const deselectEvent = new CustomEvent("classFilterChanged", {
        bubbles: true,
        detail: { selectedClass: null },
      });
      this.dispatchEvent(deselectEvent);
    } else {
      // Select new class
      this.selectedClass = classType;
      this.updateButtonStyles();

      // Dispatch event with the selected class
      const selectEvent = new CustomEvent("classFilterChanged", {
        bubbles: true,
        detail: { selectedClass: classType },
      });
      this.dispatchEvent(selectEvent);
    }
  };

  updateButtonStyles() {
    const buttons = this.querySelectorAll(".class-filter-btn");
    buttons.forEach((button) => {
      const classType = button.dataset.class;

      if (this.selectedClass === null) {
        // No class selected, remove active state from all
        button.classList.remove("active");
        button.style.borderColor = "#4b5563"; // Default border
      } else if (classType === this.selectedClass) {
        // Active
        button.classList.add("active");
        button.style.borderColor =
          CLASS_COLORS[classType] || CLASS_COLORS.default;
      } else {
        // Inactive
        button.classList.remove("active");
        button.style.borderColor = "#4b5563"; // Default border
      }
    });
  }

  render() {
    // Use a simplified HTML structure with no extra whitespace
    const buttonsHtml = Object.entries(CLASS_ICONS)
      .map(
        ([classType, iconUrl]) =>
          `<button class="class-filter-btn ${
            this.selectedClass === classType ? "active" : ""
          }" data-class="${classType}" style="border-color: ${
            this.selectedClass === classType
              ? CLASS_COLORS[classType] || CLASS_COLORS.default
              : "#4b5563"
          }" aria-label="Filter by ${classType}" title="${classType}"><img src="${iconUrl}" alt="${classType}" class="class-icon"/></button>`
      )
      .join("");

    this.innerHTML = `
      <div class="class-filters">
        <div class="class-filter-buttons">${buttonsHtml}</div>
      </div>
    `;
  }
}

customElements.define("class-filter-buttons", ClassFilterButtons);
