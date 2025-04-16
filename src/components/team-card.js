class TeamCard extends HTMLElement {
  connectedCallback() {
    const { name = "Team Name", description = "Team Desc" } = this.dataset;
    this.innerHTML = `
      <div class="border-2 border-black rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
        <h2 class="text-2xl font-bold mb-3">${name}</h2>
        <p class="text-gray-600 mb-4">${description}</p>
        <button class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md">
          Join
        </button>
      </div>
    `;
  }
}
customElements.define("team-card", TeamCard);
