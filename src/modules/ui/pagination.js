// export function createPagination(totalPages, currentPage) {
//   const paginationContainer = document.getElementById("pagination");
//   if (!paginationContainer) return;
//   paginationContainer.innerHTML = "";

//   if (totalPages <= 1) return;

//   const paginationControls = document.createElement("div");
//   paginationControls.classList.add("pagination-controls");

//   // First button
//   const firstBtn = createPaginationButton("&laquo;", currentPage === 1, () => {
//     // Instead of directly calling displayPage, we'll dispatch a custom event
//     const event = new CustomEvent("changePage", { detail: { page: 1 } });
//     document.dispatchEvent(event);
//   });
//   paginationControls.appendChild(firstBtn);

//   // Previous button
//   const prevBtn = createPaginationButton("&lsaquo;", currentPage === 1, () => {
//     if (currentPage > 1) {
//       const event = new CustomEvent("changePage", {
//         detail: { page: currentPage - 1 },
//       });
//       document.dispatchEvent(event);
//     }
//   });
//   paginationControls.appendChild(prevBtn);

//   // Next button
//   const nextBtn = createPaginationButton(
//     "&rsaquo;",
//     currentPage === totalPages,
//     () => {
//       if (currentPage < totalPages) {
//         const event = new CustomEvent("changePage", {
//           detail: { page: currentPage + 1 },
//         });
//         document.dispatchEvent(event);
//       }
//     }
//   );
//   paginationControls.appendChild(nextBtn);

//   // Last button
//   const lastBtn = createPaginationButton(
//     "&raquo;",
//     currentPage === totalPages,
//     () => {
//       const event = new CustomEvent("changePage", {
//         detail: { page: totalPages },
//       });
//       document.dispatchEvent(event);
//     }
//   );
//   paginationControls.appendChild(lastBtn);

//   paginationContainer.appendChild(paginationControls);

//   // Page counter
//   const pageCounter = document.createElement("div");
//   pageCounter.classList.add("page-counter");
//   pageCounter.textContent = `Page ${currentPage} of ${totalPages}`;
//   paginationContainer.appendChild(pageCounter);
// }

// function createPaginationButton(html, disabled, onClick) {
//   const btn = document.createElement("button");
//   btn.innerHTML = html;
//   btn.classList.add("pagination-btn");
//   btn.disabled = disabled;
//   btn.addEventListener("click", onClick);
//   return btn;
// }
// Updated modules/ui/pagination.js

export function createPagination(totalPages, currentPage) {
  // Get all pagination components on the page
  const paginationButtons = document.querySelectorAll("pagination-buttons");

  // Update each component with the same pagination state
  paginationButtons.forEach((component) => {
    component.config = {
      currentPage,
      totalPages,
    };
  });
}
