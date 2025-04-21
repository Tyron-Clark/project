// Create a new file: components/pagination-component.js

class PaginationButtons extends HTMLElement {
  constructor() {
    super();
    this._currentPage = 1;
    this._totalPages = 1;
  }

  connectedCallback() {
    this.render();
    this.addEventListener("click", this.handleClick);
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.handleClick);
  }

  handleClick = (event) => {
    const btn = event.target.closest("button");
    if (!btn || btn.disabled) return;

    let newPage = this._currentPage;

    if (btn.dataset.action === "first") {
      newPage = 1;
    } else if (btn.dataset.action === "prev") {
      newPage = Math.max(1, this._currentPage - 1);
    } else if (btn.dataset.action === "next") {
      newPage = Math.min(this._totalPages, this._currentPage + 1);
    } else if (btn.dataset.action === "last") {
      newPage = this._totalPages;
    }

    if (newPage !== this._currentPage) {
      const event = new CustomEvent("changePage", {
        bubbles: true,
        detail: { page: newPage },
      });
      this.dispatchEvent(event);
    }
  };

  set config({ currentPage, totalPages }) {
    this._currentPage = currentPage;
    this._totalPages = totalPages;
    this.render();
  }

  render() {
    if (this._totalPages <= 1) {
      this.innerHTML = "";
      return;
    }

    this.innerHTML = `
      <div class="pagination">
        <div class="pagination-controls">
          <button 
            class="pagination-btn" 
            data-action="first" 
            ${this._currentPage === 1 ? "disabled" : ""}
            aria-label="First page"
          >&laquo;</button>
          <button 
            class="pagination-btn" 
            data-action="prev" 
            ${this._currentPage === 1 ? "disabled" : ""}
            aria-label="Previous page"
          >&lsaquo;</button>
          <button 
            class="pagination-btn" 
            data-action="next" 
            ${this._currentPage === this._totalPages ? "disabled" : ""}
            aria-label="Next page"
          >&rsaquo;</button>
          <button 
            class="pagination-btn" 
            data-action="last" 
            ${this._currentPage === this._totalPages ? "disabled" : ""}
            aria-label="Last page"
          >&raquo;</button>
        </div>
        <div class="page-counter">
          Page ${this._currentPage} of ${this._totalPages}
        </div>
      </div>
    `;
  }
}

customElements.define("pagination-buttons", PaginationButtons);
