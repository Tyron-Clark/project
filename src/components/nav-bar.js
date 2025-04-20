class NavBar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
    <nav
      class="sticky top-0 flex flex-col lg:flex-row lg:justify-between items-center px-4 px-6 md:px-10 py-5 border-b-2 border-black shadow-lg bg-white z-50"
    >
      <h1
        id="brand"
        class="text-3xl sm:text-4xl md:text-5xl font-['Racing_Sans_One'] mb-4"
      >
        <a href="http://localhost:3000/" id="brandLink">elefem</a>
      </h1>
      <div
        class="flex flex-col lg:flex-row items-center gap-4 md:gap-8 w-full md:w-auto"
      >
        <ul
          id="navLinks"
          class="flex flex-wrap justify-center gap-4 md:gap-8 text-lg sm:text-xl md:text-2xl"
        >
          <li>
            <a href="http://localhost:3000/" id="homeLink" class="hover:text-red-500">Home</a>
          </li>
          <li>
            <a href="http://localhost:3000/ladder" id="ladderLink" class="hover:text-red-500">Ladder</a>
          </li>
          <li>
            <a href="" id="formsLink" class="hover:text-red-500">Forms</a>
          </li>
          <li>
            <a href="" id="tournamentsLink" class="hover:text-red-500"
              >Tournaments</a
            >
          </li>
        </ul>
        <div id="authLinks" class="flex gap-3 sm:gap-4 mt-4 md:mt-0">
          <a
            href=""
            id="signInLink"
            class="bg-gray-300 px-2.5 py-1.5 rounded-lg hover:bg-gray-500 ring-2 ring-black"
            >Sign In</a
          >
          <a
            href=""
            id="RegisterLink"
            class="bg-gray-800 px-2.5 py-1.5 rounded-lg text-white hover:bg-black ring-2 ring-black"
            >Register</a
          >
        </div>
      </div>
    </nav>`;
  }
}
customElements.define("nav-bar", NavBar);
